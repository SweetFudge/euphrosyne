package com.jobfinder.service;

import com.jobfinder.dto.JobRequest;
import com.jobfinder.exception.JobNotFoundException;
import com.jobfinder.mapper.JobMapper;
import com.jobfinder.model.Job;
import com.jobfinder.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Spy
    private JobMapper jobMapper = new JobMapper();

    @InjectMocks
    private JobService jobService;

    @Test
    void createReturnsSavedJob() {
        when(jobRepository.save(any(Job.class))).thenAnswer(inv -> {
            Job job = inv.getArgument(0);
            job.setId(1L);
            return job;
        });

        var response = jobService.create(new JobRequest("Dev Java", "Acme", "Paris", null, null));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Dev Java");
    }

    @Test
    void findByIdThrowsWhenMissing() {
        when(jobRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.findById(42L)).isInstanceOf(JobNotFoundException.class);
    }
}
