'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {}
  // initialize new book model
  Book.init({
    // set title column
    title: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title field cannot be empty'
        }, 
        notNull: {
           msg: 'Title field cannot be empty'
        }
      }
    }, 
    // set author column
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author field cannot be empty'
        },
        notNull: {
          msg: 'Author field cannot be empty'
        }
      }
    }, 
    // set genre column
    genre: DataTypes.STRING,
    // set year column
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};