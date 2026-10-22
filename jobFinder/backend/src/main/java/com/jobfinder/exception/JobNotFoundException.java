package com.jobfinder.exception;

public class JobNotFoundException extends RuntimeException {

    public JobNotFoundException(Long id) {
        super("Offre introuvable : " + id);
    }
}
