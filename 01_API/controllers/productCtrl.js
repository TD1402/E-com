const Products = require("../models/productModel");
const Type = require("../models/typeModel");
const DetailProduct = require("../models/detailProductModel");
const feedbackCtrl = require("./feedback/feedbackCtrl");
// Filter, sorting and paginating

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal = lớn hơn hoặc bằng
    //    lte = lesser than or equal = nhỏ hơn hoặc bằng
    //    lt = lesser than = ít hơn
    //    gt = greater than = lớn hơn
    // regex = search to nung sue
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting();

      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.query;
      const products = await Products.find({ category: category });

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { types, title, description, images, category, user_cre, role } =
        req.body;
      console.log("dasdasd", req.body);
      var listType = [];
      for (var i = 0; i < types.length; i++) {
        const typeItem = new Type({
          name: types[i].name,
          price: types[i]?.price,
          amount: types[i].amount,
        });
        listType.push(typeItem);
      }
      const price = types[0]?.price;

      if (!images)
        return res.status(400).json({ msg: "Không có hình ảnh tải lên" });
      const product = await Products.findOne({ title: title });
      console.log(title, "333");
      if (product)
        return res.status(400).json({ msg: "Sản phẩm này đã tồn tại." });
      const newProduct = new Products({
        types: listType,
        title: title,
        description: description,
        images: images,
        category: category,
        price: price,
        user_cre: user_cre,
        role: role,
      });
      await newProduct.save();
      res.json({ msg: "Product create!", newProduct });
    } catch (err) {
      console.log(err, "44444");
      return res.status(500).json({ msg: "Internal Server" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Đã xóa một sản phẩm" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { types, title, description, images, category } = req.body;
      console.log("Request body:", req.body);

      let listType = [];

      // Kiểm tra nếu types được cung cấp trong yêu cầu
      if (types && types.length > 0) {
        for (let i = 0; i < types.length; i++) {
          let type;

          if (types[i] && types[i]._id != null) {
            type = await Type.findOneAndUpdate(
              { _id: types[i]._id },
              {
                name: types[i].name,
                price: types[i].price,
                amount: types[i].amount,
              },
              { new: true }
            );
          } else {
            type = new Type({
              name: types[i].name,
              price: types[i].price,
              amount: types[i].amount,
            });
            await type.save();
          }

          if (type) {
            listType.push({
              _id: type._id,
              name: type.name,
              price: type.price,
              amount: types[i].amount,
            });
          }
        }
      }

      const { id } = req.params; // Sử dụng id thay vì _id
      console.log("Product ID:", id);

      let product = await Products.findById(id);

      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      // Nếu types không được cung cấp, giữ nguyên types hiện có
      if (listType.length === 0) {
        listType = product.types;
      }

      product.types = listType;
      product.title = title || product.title;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;

      const updatedProduct = await product.save();

      console.log("Updated product:", updatedProduct);

      res.json({ message: "Cập nhật thành công", updatedProduct });
    } catch (err) {
      console.log("Error:", err.message);
      return res.status(500).json({ msg: err.message });
    }
  },

  updateProductRole: async (req, res) => {
    try {
      const { role } = req.body;

      const id = req.params.id;
      console.log(id, "ssss");
      await Products.findOneAndUpdate(
        { _id: id },
        {
          role: role,
        }
      );
      res.json({ message: "Update successful" });
    } catch (err) {
      console.log(err, "66666");
      return res.status(500).json({ msg: err.message });
    }
  },
  // searchProduct: async (req, res) => {
  //   try {
  //     const { searchToken } = req.query;
  //     const products = await Products.find({
  //       title: { $regex: searchToken, $options: "i" },
  //     });
  //     res.send(JSON.stringify(products));
  //   } catch (error) {
  //     res.send(JSON.stringify(error));
  //   }
  // },
  searchProduct: async (req, res) => {
    console.log("111111111111");
    try {
      const { searchToken } = req.body;

      if (!searchToken) {
        return res.status(400).json({ msg: "Search token is required." });
      }

      const products = await Products.find({
        $or: [
          { title: { $regex: searchToken, $options: "i" } },
          { description: { $regex: searchToken, $options: "i" } },
        ],
      });

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getDetailProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Products.findOne({ _id: productId });
      const feedback = await feedbackCtrl.getFeedbackByProductID(productId);
      const newDetailProduct = new DetailProduct({
        types: product.types,
        title: product.title.toLowerCase(),
        description: product.description,
        images: product.images,
        category: product.category,
        feedbacks: feedback,
        price: product.price,
      });
      res.send(JSON.stringify(newDetailProduct));
    } catch (error) {
      res.send(JSON.stringify(error));
    }
  },
  buyProduct: async (amount, typeId, productId) => {
    console.log("amount: " + amount + " typeId: " + typeId);
    const product = await Products.findOne({ _id: productId });
    const types = product.types.map((type) => {
      if (type._id == typeId) {
        type.amount = type.amount - amount;
      }
    });
    console.log(types, "8888");
    // if (type.amount < amount) {
    //     return false;
    // } else {
    //     await Type.findOneAndUpdate({
    //         amount: type.amount - amount
    //     });
    //     return true
    // }
  },
};
module.exports = productCtrl;
