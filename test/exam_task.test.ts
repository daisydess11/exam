 import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ExamTask from '../lib/exam_task-stack';


test('Template match snapshot', () => {
     const app = new cdk.App();
   const stack = new ExamTask.ExamTaskStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

 expect(template).toMatchSnapshot()
});
