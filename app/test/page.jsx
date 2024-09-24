"use client";
import React from 'react';
import { Home, LayoutGrid, PieChart, BookOpen, ShoppingBag, Settings, LogOut } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 bg-white dark:bg-gray-800 flex flex-col items-center py-4 space-y-8">
        <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
        <Home className="text-gray-400 dark:text-gray-300" />
        <LayoutGrid className="text-orange-500" />
        <PieChart className="text-gray-400 dark:text-gray-300" />
        <BookOpen className="text-gray-400 dark:text-gray-300" />
        <ShoppingBag className="text-gray-400 dark:text-gray-300" />
        <div className="flex-grow"></div>
        <Settings className="text-gray-400 dark:text-gray-300" />
        <LogOut className="text-gray-400 dark:text-gray-300" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Welcome, Gorry</h1>
              <p className="text-gray-500 dark:text-gray-400">Discover whatever you need easily</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input type="text" placeholder="Search product..." className="pl-10 pr-4 py-2 w-64 input input-bordered dark:bg-gray-700 dark:text-white" />
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button className="btn btn-outline btn-circle dark:bg-gray-700 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex space-x-4 mb-6">
            <button className="btn btn-outline btn-sm dark:bg-gray-700 dark:text-white">Signature</button>
            <button className="btn btn-sm dark:bg-gray-700 dark:text-white">Croissant</button>
            <button className="btn btn-outline btn-sm dark:bg-gray-700 dark:text-white">Waffle</button>
            <button className="btn btn-outline btn-sm dark:bg-gray-700 dark:text-white">Coffee</button>
            <button className="btn btn-outline btn-sm dark:bg-gray-700 dark:text-white">Ice Cream</button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {[
              { name: "Almond Brown Sugar Croissant", price: "$12.98", quantity: "3 pcs", image: "/placeholder.svg" },
              { name: "Smoke Tenderloin Slice Croissant", price: "$10.01", quantity: "2 pcs", image: "/placeholder.svg" },
              { name: "Berry Whipped Cream Croissant", price: "$8.92", quantity: "3 pcs", image: "/placeholder.svg" },
              { name: "Sweet Granulated Sugar Croissant", price: "$5.58", quantity: "1 pc", image: "/placeholder.svg" },
              { name: "Sweet Chocolate Chocochips Croissant", price: "$22.02", quantity: "2 pcs", image: "/placeholder.svg" },
              { name: "Basic Croissant La Ta Dhore", price: "$3.50", quantity: "1 pc", image: "/placeholder.svg" },
            ].map((product, index) => (
              <div key={index} className="card shadow-md dark:bg-gray-800">
                <div className="p-4">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h3 className="font-semibold mb-2 text-black dark:text-white">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{product.price} / {product.quantity}</p>
                  <button className="btn btn-outline btn-sm w-full dark:bg-gray-700 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-80 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Current Order</h2>
        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          {[
            { name: "Smoke Tenderloin Slice Croissant", price: "$10.01", quantity: 1 },
            { name: "Sweet Chocolate Chocochips Croissant", price: "$22.02", quantity: 2 },
            { name: "Sweet Granulated Sugar Croissant", price: "$5.58", quantity: 1 },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <img src="/placeholder.svg" alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-black dark:text-white">{item.name}</h3>
                <p className="text-orange-500">{item.price}</p>
              </div>
              <div className="flex items-center">
                <button className="btn btn-outline btn-xs h-6 w-6 dark:bg-gray-700 dark:text-white">-</button>
                <span className="mx-2 dark:text-white">{item.quantity}</span>
                <button className="btn btn-outline btn-xs h-6 w-6 dark:bg-gray-700 dark:text-white">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 mt-4 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-black dark:text-white">Subtotal</span>
            <span className="text-black dark:text-white">$37.61</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-black dark:text-white">Discount sales</span>
            <span className="text-red-500 dark:text-red-400">-$5.00</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-black dark:text-white">Total sales tax</span>
            <span className="text-black dark:text-white">$2.25</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-black dark:text-white">Total</span>
            <span className="text-orange-500">$34.86</span>
          </div>
        </div>
      </div>
    </div>
  );
}
