import { Queue, Worker, Job } from "bullmq";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";

const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const webhookQueue = new Queue("webhookQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 1000,
  },
});

export const syncQueue = new Queue("syncQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: 1000,
  },
});

export const logisticsQueue = new Queue("logisticsQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 1000,
  },
});

// Setup Dead-Letter Handling for Worker Failures
const createDeadLetterAlert = async (job: Job | undefined, err: Error, queueName: string) => {
  if (!job) return;
  console.error(`[DEAD_LETTER_JOB] Queue: ${queueName}, Job: ${job.name}, Error: ${err.message}`);
  
  await prisma.adminAlert.create({
    data: {
      type: "DEAD_LETTER_JOB",
      title: `Job ${job.name} Failed in ${queueName}`,
      message: err.message,
      metadata: {
        jobId: job.id,
        jobName: job.name,
        payload: job.data,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
      },
    },
  });
};

export const setupWorkerDeadLetterHandlers = (worker: any, queueName: string) => {
  worker.on("failed", async (job: any, err: any) => {
    if (job && job.attemptsMade >= (job.opts?.attempts || 5)) {
      await createDeadLetterAlert(job, err, queueName);
    }
  });
};
