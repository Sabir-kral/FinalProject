insert into users(username, password)
values ('sabir', '$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy'),
       ('sabir2', '$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy'),
       ('sabir3', '$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy'),
       ('sabir4', '$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy');

insert into customers(name, surname, email,username,password,user_id)
values ('sabir','memmedli','sabirmemmedli21152014@gmail.com','sabir','$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy',1),
       ('sabir1','memmedli','sabirmemmedli21152115@gmail.com','sabir2','$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy',2),
       ('sabir2','memmedli','sabirmemmedli211521155@gmail.com','sabir3','$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy',3),
       ('sabir3','memmedli','sabirmemmedli211521155@gmail.com','sabir4','$2a$12$zcCxYQ1o5YtyfZffZTZ0zOkY73sXhf8wf3uNhaHl6aCovFkdtR1oy',4);

insert into roles (name, customer, admin, seller) values
                                                      ('ROLE_CUSTOMER', 1, 0, 0),
                                                      ('ROLE_ADMIN', 0, 1, 0),
                                                      ('ROLE_SELLER', 0, 0, 1);

insert into user_roles(user_id,role_id)
values (1,1),
       (2,1),
       (3,3),
       (4,2);