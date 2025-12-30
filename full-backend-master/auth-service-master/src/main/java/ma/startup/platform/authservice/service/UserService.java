package ma.startup.platform.authservice.service;

import lombok.RequiredArgsConstructor;
import ma.startup.platform.authservice.model.User;
import ma.startup.platform.authservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(UUID id) {  // ← Change User en UUID ici
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
    }

    public User updateUser(UUID id, String email, String password) {
        User user = getUserById(id);

        if (email != null && !email.isEmpty()) {
            // Vérifier si l'email existe déjà
            if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
                throw new RuntimeException("Email déjà utilisé");
            }
            user.setEmail(email);
        }

        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        return userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
