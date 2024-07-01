package com.minitest_1.controller;

import com.minitest_1.model.Category;
import com.minitest_1.model.dto.CategoryBookCount;
import com.minitest_1.service.IBookService;
import com.minitest_1.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private ICategoryService categoryService;

    @Autowired
    private IBookService bookService;

    @GetMapping
    public ResponseEntity<List<Category>> listCategories() {
        List<Category> categoryList = (List<Category>) categoryService.findAll();
        return new ResponseEntity<>(categoryList, HttpStatus.OK);
    }

    @GetMapping("/book-counts")
    public ResponseEntity<List<CategoryBookCount>> listBookCounts() {
        List<CategoryBookCount> categoryBookCounts = categoryService.getCategoryBookCounts();
        return new ResponseEntity<>(categoryBookCounts, HttpStatus.OK);
    }

//    @GetMapping("/create")
//    public ModelAndView createCategoryForm() {
//        ModelAndView mav = new ModelAndView("/category/create");
//        mav.addObject("category", new Category());
//        return mav;
//    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        categoryService.save(category);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        Optional<Category> category = categoryService.findById(id);
        return category.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id) {
        Optional<Category> category = categoryService.findById(id);
        if (category.isPresent()) {
            categoryService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
