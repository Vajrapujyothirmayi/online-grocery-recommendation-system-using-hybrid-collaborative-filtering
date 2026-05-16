package com.grocery.security;

import com.grocery.models.ERole;
import com.grocery.models.Role;
import com.grocery.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRole(ERole.ROLE_CONSUMER);
        seedRole(ERole.ROLE_PRODUCER);
    }

    private void seedRole(ERole eRole) {
        Optional<Role> role = roleRepository.findByName(eRole);
        if (role.isEmpty()) {
            Role newRole = new Role();
            newRole.setName(eRole);
            roleRepository.save(newRole);
            System.out.println("Role " + eRole.name() + " seeded successfully!");
        }
    }
}
