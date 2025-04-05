-- Descrição: Estrutura das tabelas com chaves estrangeiras, tipos ENUM e constraints

-- Tabela: moldes
CREATE TABLE `moldes` (
  `codigo` varchar(12) NOT NULL,
  `description` longtext,
  `status` enum('not started','in process','completed') NOT NULL,
  `steps` int DEFAULT NULL,
  `current_step` int DEFAULT NULL,
  `begin_date` datetime(3) DEFAULT NULL,
  `delivery_date` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: componentes
CREATE TABLE `componentes` (
  `id` varchar(12) NOT NULL,
  `molde_codigo` varchar(12) DEFAULT NULL,
  `name` longtext,
  `material` longtext,
  `quantity` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `archive_3d_model` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_componentes_molde_codigo` (`molde_codigo`),
  CONSTRAINT `fk_componentes_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: maquinas
CREATE TABLE `maquinas` (
  `id` varchar(12) NOT NULL,
  `name` longtext,
  `description` longtext,
  `type` longtext,
  `department` longtext,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: processos
CREATE TABLE `processos` (
  `id` varchar(12) NOT NULL,
  `molde_codigo` varchar(12) DEFAULT NULL,
  `componentes_id` varchar(12) DEFAULT NULL,
  `description` longtext,
  `step` longtext,
  `status` enum('not started','in process','completed') NOT NULL,
  `maquina_id` varchar(12) DEFAULT NULL,
  `begin_date` datetime(3) DEFAULT NULL,
  `delivery_date` datetime(3) DEFAULT NULL,
  `notes` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_processos_molde_codigo` (`molde_codigo`),
  KEY `idx_processos_componentes_id` (`componentes_id`),
  KEY `idx_processos_maquina_id` (`maquina_id`),
  CONSTRAINT `fk_processos_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_processos_componente` FOREIGN KEY (`componentes_id`) REFERENCES `componentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_processos_maquina` FOREIGN KEY (`maquina_id`) REFERENCES `maquinas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: programacao
CREATE TABLE `programacao` (
  `id` varchar(12) NOT NULL,
  `molde_codigo` varchar(12) DEFAULT NULL,
  `componentes_id` varchar(12) DEFAULT NULL,
  `maquina_id` varchar(12) DEFAULT NULL,
  `step` longtext,
  `description` longtext,
  `date` datetime(3) DEFAULT NULL,
  `programmer` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_programacao_molde_codigo` (`molde_codigo`),
  KEY `idx_programacao_componentes_id` (`componentes_id`),
  KEY `idx_programacao_maquina_id` (`maquina_id`),
  CONSTRAINT `fk_programacao_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_programacao_componente` FOREIGN KEY (`componentes_id`) REFERENCES `componentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_programacao_maquina` FOREIGN KEY (`maquina_id`) REFERENCES `maquinas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela: chegada_acos
CREATE TABLE `chegada_acos` (
  `id` varchar(12) NOT NULL,
  `molde_codigo` varchar(12) DEFAULT NULL,
  `componentes_id` varchar(12) DEFAULT NULL,
  `type` longtext,
  `quantity` bigint DEFAULT NULL,
  `arrival_date` datetime(3) DEFAULT NULL,
  `is_arrived` tinyint(1) DEFAULT NULL,
  `supplier` longtext,
  PRIMARY KEY (`id`),
  KEY `idx_chegada_acos_componentes_id` (`componentes_id`),
  KEY `idx_chegada_acos_molde_codigo` (`molde_codigo`),
  CONSTRAINT `fk_acos_componente` FOREIGN KEY (`componentes_id`) REFERENCES `componentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_acos_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
