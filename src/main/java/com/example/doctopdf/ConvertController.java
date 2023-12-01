package com.example.doctopdf;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spire.doc.Document;
import com.spire.doc.FileFormat;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class ConvertController {

    @PostMapping(value = "/convert", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> convert(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        // Convert the uploaded file to PDF
        Document document = new Document(file.getInputStream());
        document.saveToFile("/tmp/result.pdf", FileFormat.PDF);
        document.close();

        // Prepare the file for download
        Path path = Paths.get("/tmp/result.pdf");
        byte[] pdfBytes = Files.readAllBytes(path);

        // Clean up: delete the temporary file
        Files.deleteIfExists(path);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("convert", "");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
