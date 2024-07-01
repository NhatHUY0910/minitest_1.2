package com.minitest_1.controller;

import com.minitest_1.model.Book;
import com.minitest_1.model.Category;
import com.minitest_1.service.IBookService;
import com.minitest_1.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin("*")
public class BookController {

    @Value("${file-upload}")
    private String fileUpload;

    @Autowired
    private IBookService bookService;

    @Autowired
    private ICategoryService categoryService;

//    @ModelAttribute("categories")
//    public Iterable<Category> getAllCategories() {
//        return categoryService.findAll();
//    }

    @GetMapping
    public ResponseEntity<Page<Book>> listBook(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "3") int size,
                                               @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books;

        if (search != null && !search.isEmpty()) {
            books = bookService.findAllByNameContaining(search, pageable);
        } else {
            books = bookService.findAll(pageable);
        }

        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable long id) {
        Optional<Book> book = bookService.findById(id);
        return book.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @PostMapping("/create")
//    public ResponseEntity<?> createBook(@Valid @ModelAttribute Book book,
//                                        @RequestParam("image") MultipartFile file,
//                                        BindingResult bindingResult) throws IOException {
//        if (bindingResult.hasErrors()) {
//            return new ResponseEntity<>(bindingResult.getAllErrors(), HttpStatus.BAD_REQUEST);
//        }
//
//        if (!file.isEmpty()) {
//            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//            Path path = Paths.get(fileUpload + fileName);
//            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//            book.setImage(fileName);
//        }
//
//        bookService.save(book);
//        return new ResponseEntity<>(book, HttpStatus.CREATED);
//    }

    @PostMapping("/create")
    public ResponseEntity<?> createBook(@RequestParam("name") String name,
                                        @RequestParam("author") String author,
                                        @RequestParam("price") String price,
                                        @RequestParam("category") String categoryId,
                                        @RequestParam("image") MultipartFile file) throws IOException {
        Book book = new Book();
        book.setName(name);
        book.setAuthor(author);
        book.setPrice(Double.parseDouble(price));

        Optional<Category> category = categoryService.findById(Long.parseLong(categoryId));
        if (!category.isPresent()) {
            return new ResponseEntity<>("Category not found", HttpStatus.BAD_REQUEST);
        }
        book.setCategory(category.get());

        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(fileUpload + fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            book.setImage(fileName);
        }

        bookService.save(book);
        return new ResponseEntity<>(book, HttpStatus.CREATED);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateBook(@PathVariable("id") Long id, @Valid @RequestBody Book book, BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            return new ResponseEntity<>(bindingResult.getAllErrors(), HttpStatus.BAD_REQUEST);
//        }
//        Optional<Book> currentBook = bookService.findById(id);
//        if (currentBook.isPresent()) {
//            book.setId(id);
//            bookService.save(book);
//            return new ResponseEntity<>(book, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable("id") Long id,
                                        @RequestBody Book updatedBook) throws IOException {
        Optional<Book> currentBookOptional = bookService.findById(id);
        if (!currentBookOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Book currentBook = currentBookOptional.get();
        currentBook.setName(updatedBook.getName());
        currentBook.setAuthor(updatedBook.getAuthor());
        currentBook.setPrice(updatedBook.getPrice());

        if (updatedBook.getCategory() != null && updatedBook.getCategory().getId() != null) {
            Optional<Category> category = categoryService.findById(updatedBook.getCategory().getId());
            if (!category.isPresent()) {
                return new ResponseEntity<>("Category not found", HttpStatus.BAD_REQUEST);
            }
            currentBook.setCategory(category.get());
        }

        bookService.save(currentBook);
        return new ResponseEntity<>(currentBook, HttpStatus.OK);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> updateBookImage(@PathVariable("id") Long id,
                                             @RequestParam("image") MultipartFile file) throws IOException {
        Optional<Book> currentBookOptional = bookService.findById(id);
        if (!currentBookOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Book currentBook = currentBookOptional.get();

        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(fileUpload + fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            currentBook.setImage(fileName);
            bookService.save(currentBook);
        }

        return new ResponseEntity<>(currentBook, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id){
        Optional<Book> currentBook = bookService.findById(id);
        if (currentBook.isPresent()) {
            bookService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> listCategories() {
        List<Category> categories = (List<Category>) categoryService.findAll();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) throws IOException {
        Path path = Paths.get(fileUpload + fileName);
        Resource resource = new UrlResource(path.toUri());

        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
