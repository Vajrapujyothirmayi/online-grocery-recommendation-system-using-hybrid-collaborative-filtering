package com.grocery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

import com.grocery.models.ERole;
import com.grocery.models.Role;
import com.grocery.repository.RoleRepository;

@SpringBootApplication
public class GroceryApplication {

    public static void main(String[] args) {
        SpringApplication.run(GroceryApplication.class, args);
    }

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(ERole.ROLE_CONSUMER).isEmpty()) {
                Role consumerRole = new Role();
                consumerRole.setName(ERole.ROLE_CONSUMER);
                roleRepository.save(consumerRole);
            }
            if (roleRepository.findByName(ERole.ROLE_PRODUCER).isEmpty()) {
                Role producerRole = new Role();
                producerRole.setName(ERole.ROLE_PRODUCER);
                roleRepository.save(producerRole);
            }
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);
            }
        };
    }
}
