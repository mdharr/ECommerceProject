package com.luv2code.ecommerce.dtos;

import lombok.Data;

@Data
public class CustomerDTO {
    private int id;
    private String username;

    public CustomerDTO(int id, String username) {
        this.id = id;
        this.username = username;
    }
}
