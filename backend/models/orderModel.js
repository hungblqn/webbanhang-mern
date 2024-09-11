import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    receiverName: {
      type: String,
      required: true
    },
    address:{
      type: String,
      required: true
    },
    phoneNumber:{
      type: Number,
      required: true
    },
    totalMoney: {
      type: Number,
      required: true,
    },
    status:{
      type: String,
      required: true,
      default: "Pending"
    }
    ,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
