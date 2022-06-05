import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async register(createUserDto: CreateUserDto) {
    if(await (this.findOne(createUserDto.username)) !== null){
      return 'This user already exists';
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(createUserDto.password, salt, (err, hash) => {
        this.userRepository.save({username: createUserDto.username, password: hash});
      })
    })
    return `{username: ${createUserDto.username}}`;
  }

  findAll() {
    return this.userRepository.find({select: ['id', 'username']});
  }

  async findOne(username: string): Promise<User> {
    const user = await (this.userRepository.findOne({
      select:['id','username', 'password'],
      where:{
        username: username
      }
    }));
    return user;
  }

  async findOneById(id: number): Promise<User>{
    const user = await (this.userRepository.findOne({
      select:['id','username', 'password'],
      where:{
        id: id
      }
    }));
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({id}, updateUserDto)
    return `Changes applied`;
  }

  async remove(id: number) {
    await this.userRepository.delete({id})
    return `This user was deleted`;
  }
}
