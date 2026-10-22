package com.jobfinder.mapper;

import com.jobfinder.dto.JobRequest;
import com.jobfinder.dto.JobResponse;
import com.jobfinder.model.Job;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    public Job toEntity(JobRequest request) {
        return Job.builder()
                .title(request.title())
                .company(request.company())
                .location(request.location())
                .description(request.description())
                .url(request.url())
                .build();
    }

    public JobResponse toResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getDescription(),
                job.getUrl(),
                job.getCreatedAt()
        );
    }
}
