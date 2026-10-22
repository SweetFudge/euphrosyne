package com.jobfinder.controller;

import com.jobfinder.dto.JobRequest;
import com.jobfinder.dto.JobResponse;
import com.jobfinder.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public List<JobResponse> list(@RequestParam(required = false) String q) {
        return jobService.search(q);
    }

    @GetMapping("/{id}")
    public JobResponse get(@PathVariable Long id) {
        return jobService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse create(@Valid @RequestBody JobRequest request) {
        return jobService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        jobService.delete(id);
    }
}
