import nodemailer from 'nodemailer'

// Replace these values with your actual Gmail credentials
const emailUser = 'webbanhang-mern-stack@hotmail.com';
const emailPass = 'Webbanhang123';

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: emailUser, // Địa chỉ email của bạn
    pass: emailPass // Mật khẩu ứng dụng hoặc mật khẩu tài khoản Google
  }
});

export const verifyEmail = async (email, subject, link) => {
  try {
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: subject,
      html: `
        <div>
          <p>Chúc mừng bạn đã đăng ký tài khoản thành công</p>
          <p>Trước khi bắt đầu mua hàng tại website, bạn cần phải xác thực tài khoản</p>
          <a href="${link}">Bấm vào đây để xác thực tài khoản</a>
        </div>`
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const resetPassword = async (email, subject, link) => {
  try {
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: subject,
      html: `
        <div>
          <p>Cảm ơn bạn đã sử dụng dịch vụ đặt lại mật khẩu của chúng tôi</p>
          <a href="${link}">Bấm vào đây để đi đến trang reset mật khẩu</a>
        </div>`
    });

    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
/*
const mailOptions = {
  from: emailUser, // Địa chỉ email người gửi
  to: 'viethungblqn@gmail.com', // Địa chỉ email người nhận
  subject: 'Subject of the email',
  text: 'Body of the email'
};

// Send email using nodemailer
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
*/