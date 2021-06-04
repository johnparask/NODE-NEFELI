SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthDate` date NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` text NOT NULL,
  `info` varchar(255) NOT NULL,
  `creatorID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_fk_userid_idx` (`creatorID`),
  CONSTRAINT `categories_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
);
CREATE TABLE `posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `content` longtext NOT NULL,
  `likes` int unsigned NOT NULL DEFAULT '0',
  `comments` int unsigned NOT NULL,
  `categoryID` int unsigned NOT NULL,
  `creatorID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_fk_userid_idx` (`creatorID`),
  KEY `posts_fk_categoryid_idx` (`categoryID`),
  CONSTRAINT `posts_fk_categoryid` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`),
  CONSTRAINT `posts_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
);
CREATE TABLE `subscriptions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userID` int unsigned NOT NULL,
  `categoryID` int unsigned NOT NULL,
  `subscribedDate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subs_fk_userid_idx` (`userID`),
  KEY `subs_fk_categoryid_idx` (`categoryID`),
  CONSTRAINT `subs_fk_categoryid` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`),
  CONSTRAINT `subs_fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
);
CREATE TABLE `comments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `likes` int unsigned NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `creatorID` int unsigned NOT NULL,
  `postID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_fk_userid_idx` (`creatorID`),
  KEY `comments_fk_postid_idx` (`postID`),
  CONSTRAINT `comments_fk_postid` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`),
  CONSTRAINT `comments_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
);
CREATE TABLE `likes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `postID` int unsigned NOT NULL,
  `userID` int unsigned NOT NULL,
  `likedDate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `likes_fk_userid_idx` (`userID`),
  KEY `likes_fk_postid_idx` (`postID`),
  CONSTRAINT `likes_fk_postid` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`),
  CONSTRAINT `likes_fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
);

SET FOREIGN_KEY_CHECKS = 1; 




