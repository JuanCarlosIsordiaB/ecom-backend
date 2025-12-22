import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    //console.log(createCouponDto.expirationDate);
    const expirationDate = new Date(createCouponDto.expirationDate);
    const newCoupon = this.couponRepository.create({
      ...createCouponDto,
      expirationDate,
    });
    return await this.couponRepository.save(newCoupon);
  }

  async findAll() {
    return await this.couponRepository.find();
  }

  async findOneByID(id: number) {
    const couponFound = await this.couponRepository.findOneBy({ id });
    console.log(couponFound);
    if (!couponFound) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return couponFound;
  }
  async findOneByName(name: string) {
    const couponFound = await this.couponRepository.findOneBy({ name });
    //console.log(couponFound);
    if (!couponFound) {
      throw new NotFoundException(`Coupon with name ${name} not found`);
    }
    return couponFound;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const couponFound = await this.findOneByID(id);
    const updatedCoupon = Object.assign(couponFound, updateCouponDto);
    return await this.couponRepository.save(updatedCoupon);
  }

  async remove(id: number) {
    const couponToDelete = await this.findOneByID(id);
    return await this.couponRepository.remove(couponToDelete);
  }


  async validateDate(code: string) {
    const todayDate = new Date();
    const couponFound = await this.findOneByName(code);
    const expirationDate = new Date(couponFound.expirationDate);

    if(expirationDate < todayDate){
      console.log('Coupon expired');
      return false;
    }
    return true;
  }

  async validateCoupon(code: string){
    const couponFound = await this.findOneByName(code);
    if(!await this.validateDate(code)){
      throw new NotFoundException(`Coupon with name ${code} is expired`);
    }
    return {
      status: 'valid',
      ...couponFound 
    };

  }

}
