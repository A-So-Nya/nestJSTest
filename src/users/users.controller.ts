import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(@Param('id') id: number, @Request() req) {
    if(req.user?.id == (await this.usersService.findOneById(+id))?.id){
      return this.usersService.findOneById(id);
    } else {
      return "You can't view this user";
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if(req.user?.id == (await this.usersService.findOneById(+id))?.id){
      return this.usersService.update(+id, updateUserDto);
    } else {
      return "You can't change this user";
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    if(req.user?.id == (await this.usersService.findOneById(+id))?.id){
      return this.usersService.remove(+id);
    } else {
      return "You can't delete this user";
    }
  }
}
