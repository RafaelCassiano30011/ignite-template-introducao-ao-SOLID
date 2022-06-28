import { User } from "../../model/User";
import { IUsersRepository, ICreateUserDTO } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  private users: User[];

  private static INSTANCE: UsersRepository;

  private constructor() {
    this.users = [];
  }

  public static getInstance(): UsersRepository {
    if (!UsersRepository.INSTANCE) {
      UsersRepository.INSTANCE = new UsersRepository();
    }

    return UsersRepository.INSTANCE;
  }

  create({ name, email }: ICreateUserDTO): User {
    const userAlreadyExists = this.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("Email already exists");
    }

    const user = new User();

    Object.assign(user, {
      name,
      email,
    });

    this.users.push(user);

    return user;
  }

  findById(id: string): User | undefined {
    const userAlreadyExists = this.users.find((user) => user.id === id);

    if (!userAlreadyExists) {
      throw new Error("User not found");
    }

    return userAlreadyExists;
  }

  findByEmail(email: string): User | undefined {
    const userAlreadyExists = this.users.find((user) => user.email === email);

    return userAlreadyExists;
  }

  turnAdmin(receivedUser: User): User {
    const user = { ...receivedUser, admin: true, updated_at: new Date() };

    const newUsers = this.users.map((item) => {
      if (item.id === receivedUser.id) {
        return user;
      }

      return item;
    });

    this.users = newUsers;

    return user;
  }

  list(): User[] {
    return this.users;
  }
}

export { UsersRepository };
