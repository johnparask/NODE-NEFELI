SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `auth_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userID` int unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `expired` int NOT NULL DEFAULT '0',
  `expireDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `auth_fk_userid_idx` (`userID`),
  CONSTRAINT `auth_fk_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`id`)
);

CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` text NOT NULL,
  `info` varchar(255) NOT NULL,
  `creatorID` int unsigned NOT NULL,
  `subscriptions` int unsigned NOT NULL DEFAULT '0',
  `posts` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `categories_fk_userid_idx` (`creatorID`),
  CONSTRAINT `categories_fk_userid` FOREIGN KEY (`creatorID`) REFERENCES `users` (`id`)
);
CREATE TABLE `comments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `likes` int unsigned NOT NULL DEFAULT '0',
  `date` datetime NOT NULL,
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
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthDate` date NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
);

SET FOREIGN_KEY_CHECKS = 1; 

INSERT INTO readit.categories (id, categoryName, info, creatorID, subscriptions, posts) VALUES ('1', 'Web Development', 'This is a category for all of you who want to learn how to be a developer. Share tips and ask questions to help each other!', '1', '0', '0');
INSERT INTO readit.categories (id, categoryName, info, creatorID, subscriptions, posts) VALUES ('2', 'Cats', 'Please share your cat pictures! Cats are the very best thing that has happened to our lives.. So please so me your cats!', '1', '0', '0');
INSERT INTO readit.categories (id, categoryName, info, creatorID, subscriptions, posts) VALUES ('3', 'Travel', 'Do you crave some new experiences? If so, this is the right category for you to make some new friends and show your travelling experiences.', '1', '0', '0');

INSERT INTO readit.posts (id, title, content, likes, comments, categoryID, creatorID) VALUES ('1', 'PHP is better!', 'Do you want to be a web developer? Tip NO 1, DO NOT USE HBS! 1000 reasons why...', '0', '0', '1', '1');
INSERT INTO readit.posts (id, title, content, likes, comments, categoryID, creatorID) VALUES ('2', 'Why to not use Elementor/WP Bakery', 'You have hands, right? Then use them! ', '0', '0', '1', '1');
INSERT INTO readit.posts (id, title, content, likes, comments, categoryID, creatorID) VALUES ('3', 'How to annoy your hooman?', 'Do you ever think about your life choices? Do you feel like you are not annoying enough? Then, this guide will open your eyes! Run at 4 am like a ninja. Throw glasses. Chew cables (not electrical ones..). Ideally find expensive equipment and destroy it! And remember.. if your hooman is mad, show your belly >.<', '0', '0', '2', '1');
INSERT INTO readit.posts (id, title, content, likes, comments, categoryID, creatorID) VALUES ('4', 'Do you to travel and you are working?', 'Too bad for you.. :) Wait for retirement', '0', '0', '3', '1');