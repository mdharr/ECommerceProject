import { CartItem } from "./cart-item";

export class OrderItem {

  public imageUrl: string;
  public unitPrice: number;
  public quantity: number;
  public productId: string;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.unitPrice = cartItem.unitPrice;
    this.quantity = cartItem.quantity;
    this.productId = String(cartItem.id);
  }
}
