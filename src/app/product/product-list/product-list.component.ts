import {Component, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {Product} from "../../models/product";
import {CartService} from "../../cart/cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOrder: string = "";

  constructor(private productService: ProductService,
              private cartSevice: CartService,
              private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    })
  }

  addToCart(product: Product): void {
    this.cartSevice.addToCart(product).subscribe({
      next: () => {
        this.snackbar.open("Product added to cart");
      }
    });
  }

  applyFilter(event: Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(
      product => product.name.toLowerCase().includes((searchTerm)));

    this.sortProducts(this.sortOrder);
  }

  sortProducts(event:MatSelectChange | string) {
    const sortValue = typeof event === 'string' ? event : event.value;
    this.sortOrder = sortValue;

    if(this.sortOrder === "priceLowHigh") {
      this.filteredProducts.sort((a,b) => a.price - b.price);
    } else if(this.sortOrder === "priceHighLow") {
      this.filteredProducts.sort((a,b) => b.price - a.price);
    }
  }

}
