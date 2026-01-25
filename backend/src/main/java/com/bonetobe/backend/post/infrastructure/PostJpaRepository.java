package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostJpaRepository extends JpaRepository<Post, Long> {}
