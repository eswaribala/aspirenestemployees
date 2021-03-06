import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";

import mongoose, { Model } from 'mongoose';
import {Task, TaskDocument} from "../schemas/task-schema";
import {TaskDTO} from "../models/taskdto";
import {UpdateTaskDTO} from "../models/taskupdatedto";
import {Employee, EmployeeDocument} from "../schemas/employee-schema";



@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private readonly model: Model<TaskDocument>,
       // @InjectModel(Employee.name) private readonly empmodel: Model<EmployeeDocument>
    ) {}
//select all
    async findAll(): Promise<Task[]> {


        return this.model.find().populate('employees', null, Employee.name)
            .exec()
    }

    //select with where
    async findOne(taskId:string): Promise<Task> {
      var id= new mongoose.Types.ObjectId(taskId);
      return await this.model.findById(id).exec();
        //return await this.model.find({taskId:taskId}).exec();
    }

    async findByName(tName:string): Promise<Task[]> {
       console.log(tName);
        return await this.model.find({taskName:tName}).exec();
    }
//insert query
    async create(taskDTO: TaskDTO):Promise<TaskDTO> {

        return await  new this.model({
            ...taskDTO,
            createdAt: new Date(),
        }).save();



    }
//update
    async update(taskId, updateTaskDto: UpdateTaskDTO) {
        var id= new mongoose.Types.ObjectId(taskId)
        updateTaskDto.employees.forEach(x=>{
             this.model.findByIdAndUpdate({_id:id},
                {$push:{employees:x}}).exec();
        })

    }
//delete
    async delete(taskId: string): Promise<Task> {
        var id= new mongoose.Types.ObjectId(taskId)
        return await this.model.findByIdAndDelete(id).exec();
    }


}
