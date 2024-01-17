/*
  Warnings:

  - You are about to drop the `_PuzzleToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PuzzleToUser" DROP CONSTRAINT "_PuzzleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PuzzleToUser" DROP CONSTRAINT "_PuzzleToUser_B_fkey";

-- DropTable
DROP TABLE "_PuzzleToUser";

-- CreateTable
CREATE TABLE "Solved" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "puzzleId" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "Solved_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Solved" ADD CONSTRAINT "Solved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solved" ADD CONSTRAINT "Solved_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "puzzles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
