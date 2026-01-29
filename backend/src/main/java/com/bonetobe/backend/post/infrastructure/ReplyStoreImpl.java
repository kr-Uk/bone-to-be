package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Reply;
import com.bonetobe.backend.post.domain.ReplyStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReplyStoreImpl implements ReplyStore {
    private final ReplyJpaRepository replyJpaRepository;

    @Override
    public Reply save(Reply reply){ return replyJpaRepository.save(reply);}

    @Override
    public void delete(Reply reply){
        replyJpaRepository.delete(reply);
    }

}
