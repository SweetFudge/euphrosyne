package com.euphrosyne.service;

import com.euphrosyne.dto.NewsletterCampaignRequestDto;
import com.euphrosyne.model.Newsletter;
import com.euphrosyne.model.NewsletterCampaign;
import com.euphrosyne.repository.NewsletterCampaignRepository;
import com.euphrosyne.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class NewsletterCampaignService {

    private final NewsletterCampaignRepository newsletterCampaignRepository;
    private final NewsletterRepository newsletterRepository;

    // private final JavaMailSender mailSender;
    // @Value("${app.mail.from}") private String mailFrom;
    // @Value("${app.mail.from-name}") private String mailFromName;

    public List<NewsletterCampaign> findAll() {
        return newsletterCampaignRepository.findAllByOrderBySentAtDesc();
    }

    public NewsletterCampaign send(NewsletterCampaignRequestDto dto) {
        List<Newsletter> activeSubscribers = newsletterRepository.findAllByActiveTrue();

        // ── Envoi emails (décommenter quand SMTP configuré) ────────────────────
        // for (Newsletter subscriber : activeSubscribers) {
        //     try {
        //         MimeMessage message = mailSender.createMimeMessage();
        //         MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        //         helper.setFrom(mailFrom, mailFromName);
        //         helper.setTo(subscriber.getEmail());
        //         helper.setSubject(dto.getSubject());
        //         helper.setText(dto.getHtmlContent(), true);
        //         mailSender.send(message);
        //     } catch (Exception e) {
        //         // Loguer l'erreur sans interrompre l'envoi aux autres abonnés
        //         System.err.println("Erreur envoi email à " + subscriber.getEmail() + " : " + e.getMessage());
        //     }
        // }
        // ───────────────────────────────────────────────────────────────────────

        return newsletterCampaignRepository.save(NewsletterCampaign.builder()
                .subject(dto.getSubject())
                .htmlContent(dto.getHtmlContent())
                .designJson(dto.getDesignJson())
                .recipientCount(activeSubscribers.size())
                .build());
    }
}
