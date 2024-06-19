import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";

const Feedback = (feedback) => {
  const feedbacks = feedback.feedback;
  const colors = {
    orange: "#FFA500",
    grey: "#808080",
  };

  feedbacks.map((item, i) => {});
  const [result, setResult] = useState();
  useEffect(() => {
    if (feedbacks) {
      var total = 0;
      feedbacks.map((item) => {
        total += item.rating;
      });
      setResult(total / feedbacks.length);
    }
  }, [feedbacks]);
  var totalstart = 0;
  var start1 = 0;
  var start2 = 0;
  var start3 = 0;
  var start4 = 0;
  var start5 = 0;
  feedbacks.map((item) => {
    totalstart++;
    switch (item.rating) {
      case 1:
        start1++;
        break;
      case 2:
        start2++;
        break;
      case 3:
        start3++;
        break;
      case 4:
        start4++;
        break;
      case 5:
        start5++;
        break;
      default:
        break;
    }
  });

  const startNumber = parseFloat(start5);
  const totalNumber = parseFloat(totalstart);

  // Check if the numbers are valid before performing the calculation
  const percentage = (startNumber / totalNumber) * 100;
  return (
    <>
      <div className="padding-feedback">
        <span className="heading-feedback">Đánh giá của người dùng</span>
        <span>{feedbacks.rating}</span>
        <p>
          <Rating
            initialRating={result}
            emptySymbol={<FaStar color={colors.grey} className="icon" />}
            fullSymbol={<FaStar color={colors.orange} className="icon" />}
            readonly
          />
          &nbsp;{feedbacks.length} Trung bình dựa trên đánh giá。
        </p>
        {/* commnet */}
        <hr style={{ border: "3px solid #f1f1f1" }} />
      </div>
      <div className="row-feedback padding-feedback">
        <div className="side-feedback">
          <div>5 Sao</div>
        </div>
        <div className="middle-feedback">
          <div className="bar-container-feedback">
            <div
              className="bar-5"
              style={{ width: `${(start5 / totalNumber) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="side-feedback right-feedback">
          <div>{start5}</div>
        </div>
        <div className="side-feedback">
          <div>4 Sao</div>
        </div>
        <div className="middle-feedback">
          <div className="bar-container-feedback">
            <div
              className="bar-4"
              style={{ width: `${(start4 / totalNumber) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="side-feedback right-feedback">
          <div>{start4}</div>
        </div>
        <div className="side-feedback">
          <div>3 Sao</div>
        </div>
        <div className="middle-feedback">
          <div className="bar-container-feedback">
            <div
              className="bar-3"
              style={{ width: `${(start3 / totalNumber) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="side-feedback right-feedback">
          <div>{start3}</div>
        </div>
        <div className="side-feedback">
          <div>2 Sao</div>
        </div>
        <div className="middle-feedback">
          <div className="bar-container-feedback">
            <div
              className="bar-2"
              style={{ width: `${(start2 / totalNumber) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="side-feedback right-feedback">
          <div>{start2}</div>
        </div>
        <div className="side-feedback">
          <div>1 Sao</div>
        </div>
        <div className="middle-feedback">
          <div className="bar-container-feedback">
            <div
              className="bar-1"
              style={{ width: `${(start1 / totalNumber) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="side-feedback right-feedback">
          <div>{start1}</div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
