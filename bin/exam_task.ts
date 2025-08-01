#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ExamTaskStack } from '../lib/exam_task-stack';

const app = new cdk.App();
new ExamTaskStack(app, 'ExamTaskStack', {
  
});