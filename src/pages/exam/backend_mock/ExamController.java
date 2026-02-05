package com.lms.management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.lms.management.model.Exam;
import com.lms.management.service.ExamService;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasAuthority('EXAM_CREATE')")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        return new ResponseEntity<>(examService.createExam(exam), HttpStatus.CREATED);
    }

    // GET ALL (Missing Endpoint Fix)
    @GetMapping
    @PreAuthorize("hasAuthority('EXAM_VIEW')")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    // PUBLISH
    @PutMapping("/{examId}/publish")
    @PreAuthorize("hasAuthority('EXAM_PUBLISH')")
    public ResponseEntity<Exam> publishExam(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.publishExam(examId));
    }

    // CLOSE
    @PutMapping("/{examId}/close")
    @PreAuthorize("hasAuthority('EXAM_CLOSE')")
    public ResponseEntity<Exam> closeExam(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.closeExam(examId));
    }

    // GET
    @GetMapping("/{examId}")
    @PreAuthorize("hasAuthority('EXAM_VIEW')")
    public ResponseEntity<Exam> getExam(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getExamById(examId));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAuthority('EXAM_VIEW')")
    public ResponseEntity<List<Exam>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(examService.getExamsByCourseId(courseId));
    }

    @GetMapping("/batch/{batchId}")
    @PreAuthorize("hasAuthority('EXAM_VIEW')")
    public ResponseEntity<List<Exam>> getByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(examService.getExamsByBatchId(batchId));
    }

    // ============ DESIGN (File Upload Fix) ============

    @PostMapping(path = "/{examId}/design/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('EXAM_MANAGE')")
    public ResponseEntity<Void> uploadDesign(
            @PathVariable Long examId,
            @RequestParam("orientation") String orientation,
            @RequestParam(value = "watermarkType", defaultValue = "TEXT") String watermarkType,
            @RequestParam(value = "watermarkValue", required = false) String watermarkValue,
            @RequestParam(value = "watermarkOpacity", defaultValue = "10") Integer watermarkOpacity,
            @RequestPart(value = "instituteLogo", required = false) MultipartFile instituteLogo,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) {
        // Logic to delegate to service
        // examService.updateExamDesign(examId, orientation, ...);
        return ResponseEntity.ok().build();
    }

    // ============ DELETE APIs ============

    // SOFT DELETE
    @DeleteMapping("/{examId}")
    @PreAuthorize("hasAuthority('EXAM_DELETE')")
    public ResponseEntity<Void> softDelete(@PathVariable Long examId) {
        examService.softDeleteExam(examId);
        return ResponseEntity.noContent().build();
    }

    // RESTORE
    @PutMapping("/{examId}/restore")
    @PreAuthorize("hasAuthority('EXAM_RESTORE')")
    public ResponseEntity<Void> restore(@PathVariable Long examId) {
        examService.restoreExam(examId);
        return ResponseEntity.noContent().build();
    }

    // HARD DELETE
    @DeleteMapping("/{examId}/hard")
    @PreAuthorize("hasAuthority('EXAM_HARD_DELETE')")
    public ResponseEntity<Void> hardDelete(@PathVariable Long examId) {
        examService.hardDeleteExam(examId);
        return ResponseEntity.noContent().build();
    }
}
