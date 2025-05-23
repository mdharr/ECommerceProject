package com.luv2code.ecommerce.repositories;

import com.luv2code.ecommerce.entities.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "countries", path = "countries") // path exposes '/countries' endpoint
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
