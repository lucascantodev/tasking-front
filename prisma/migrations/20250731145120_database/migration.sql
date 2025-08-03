-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "owner" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "list_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
