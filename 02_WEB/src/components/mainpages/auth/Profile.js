import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import API_URL from "../../../api/baseAPI";
const Profile = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [user] = state.userAPI.detail;

  const [firstName, setFirstName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [sex, setSex] = useState(user.sex);
  const [birthDate, setBirthDate] = useState(user.birthday);
  const [address, setAddress] = useState(user.address);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleAddress = (e) => setAddress(e.target.value);
  const handleGenderChange = (e) => setSex(e.target.value);
  const handleBirthDateChange = (e) => setBirthDate(e.target.value);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const submitEditUser = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu PUT đến backend để cập nhật thông tin người dùng
      await axios.put(
        `${API_URL}/user/infor`,
        {
          avatar: avatar,
          birthday: birthDate,
          sex: sex,
          address: address,
        },
        {
          headers: { Authorization: token },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const birthdayDate = new Date(birthDate);

  const formattedBirthday = `${birthdayDate.getDate()}/${
    birthdayDate.getMonth() + 1
  }/${birthdayDate.getFullYear()}`;

  return (
    <>
      <div className="profile-container ">
        <div className="sidebar-profile">
          <div className="profile-header">
            <label htmlFor="avatarInput">
              <img src={avatar} alt="Avatar" className="profile-avatar" />
            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
          <ul className="sidebar-menu">
            <li>Hồ Sơ</li>
            <li>Ngân Hàng</li>
            <li>Đổi Mật Khẩu</li>
          </ul>
        </div>
        <div className="profile-content">
          <h2>Hồ Sơ Của Tôi</h2>
          <form onSubmit={submitEditUser}>
            <div className="form-wrapper">
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <div>{email}</div>
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <div>{phone}</div>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input type="text" value={address} onChange={handleAddress} />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <div className="form-group-sex">
                  <label>
                    <input
                      type="radio"
                      value="man"
                      checked={sex === "man"}
                      onChange={handleGenderChange}
                    />
                    <div>Nam</div>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="girl"
                      checked={sex === "girl"}
                      onChange={handleGenderChange}
                    />
                    <div>Nữ</div>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="other"
                      checked={sex === "other"}
                      onChange={handleGenderChange}
                    />
                    <div>Khác</div>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                {isEditing ? ( // Nếu đang trong trạng thái sửa đổi, hiển thị input
                  <input
                    type="date"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                  />
                ) : (
                  // Ngược lại, hiển thị div đã định dạng
                  <div>{formattedBirthday}</div>
                )}
                <button className="btn btn-primary" onClick={handleEditToggle}>
                  {isEditing ? "Huỷ bỏ" : "Chỉnh sửa"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-submit">
              Lưu
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
