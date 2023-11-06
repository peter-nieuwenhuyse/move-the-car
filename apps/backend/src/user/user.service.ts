import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {Public} from "../metaDataDecorators";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }
  async createUser(createUserDto: CreateUserDto) : Promise<User>{
    const user : User = new User()
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = hashPassword;
    user.gender = createUserDto.gender;
    console.log(user)
    return this.userRepository.save<User>(user)
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  findUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user: User = new User()
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.password = updateUserDto.password;
    user.gender = updateUserDto.gender;
    user.id = id;
    return this.userRepository.save(user)
  }

  removeUser(id: number) {
    return this.userRepository.delete(id);
  }

  @Public()
  async findUserByUsername(username: string) : Promise <User | undefined> {
    return this.userRepository.findOneBy({username})
  }
}
