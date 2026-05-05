package az.developia.demo.Mapper;

import az.developia.demo.Entity.CustomerEntity;
import az.developia.demo.Response.CustomerResponse;

import java.util.List;
import java.util.stream.Collectors;

public class CustomerMapper {
    public static CustomerResponse toDTO(CustomerEntity entity){
        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setId(entity.getId());
        customerResponse.setName(entity.getName());
        customerResponse.setSurname(entity.getSurname());
        customerResponse.setEmail(entity.getEmail());
        customerResponse.setUsername(entity.getUsername());
        customerResponse.setPassword(entity.getPassword());

        return customerResponse;
    }
    public static List<CustomerResponse> toDTOList(List<CustomerEntity> entities){
        return entities.stream().map(CustomerMapper::toDTO).collect(Collectors.toList());
    }
}
