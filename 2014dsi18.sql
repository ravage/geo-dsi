-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 11-Dez-2013 às 08:51
-- Versão do servidor: 5.1.57-community
-- versão do PHP: 5.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de Dados: `2014dsi18`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Praias', '2013-11-27 10:53:41', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `locations`
--

CREATE TABLE IF NOT EXISTS `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `longitude` decimal(8,6) NOT NULL,
  `latitude` decimal(8,6) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_location_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `fk_location_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
