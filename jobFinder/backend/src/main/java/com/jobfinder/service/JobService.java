package com.jobfinder.service;

import com.jobfinder.dto.JobRequest;
import com.jobfinder.dto.JobResponse;
import com.jobfinder.exception.JobNotFoundException;
import com.jobfinder.mapper.JobMapper;
import com.jobfinder.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;

    @Transactional(readOnly = true)
    public List<JobResponse> search(String query) {
        var jobs = (query == null || query.isBlank())
                ? jobRepository.findAll()
                : jobRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(query, query);
        return jobs.stream().map(jobMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public JobResponse findById(Long id) {
        return jobRepository.findById(id)
                .map(jobMapper::toResponse)
                .orElseThrow(() -> new JobNotFoundException(id));
    }

    @Transactional
    public JobResponse create(JobRequest request) {
        return jobMapper.toResponse(jobRepository.save(jobMapper.toEntity(request)));
    }

    @Transactional
    public void delete(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new JobNotFoundException(id);
        }
        jobRepository.deleteById(id);
    }
}
