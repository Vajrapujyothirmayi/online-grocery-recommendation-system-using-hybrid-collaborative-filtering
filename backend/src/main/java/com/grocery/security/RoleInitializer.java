package com.grocery.security;

import com.grocery.models.ERole;
import com.grocery.models.Role;
import com.grocery.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!roleRepository.findByName(ERole.ROLE_CONSUMER).isPresent()) {
            Role consumerRole = new Role();
            consumerRole.setName(ERole.ROLE_CONSUMER);
            roleRepository.save(consumerRole);
        }

        if (!roleRepository.findByName(ERole.ROLE_PRODUCER).isPresent()) {
            Role producerRole = new Role();
            producerRole.setName(ERole.ROLE_PRODUCER);
            roleRepository.save(producerRole);
        }

        if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }
    }
}
