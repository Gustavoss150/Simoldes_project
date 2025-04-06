-- Descrição: Estrutura das tabelas com chaves estrangeiras, tipos ENUM e constraints

-- simoldes_db.moldes definição
CREATE TABLE `moldes` (
  `codigo` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` longtext,
  `status` enum('not started','in process','completed') NOT NULL,
  `steps` bigint DEFAULT NULL,
  `current_step` bigint DEFAULT NULL,
  `begin_date` datetime(3) DEFAULT NULL,
  `delivery_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: componentes
CREATE TABLE `componentes` (
  `id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `molde_codigo` varchar(12) DEFAULT NULL,
  `name` longtext,
  `material` longtext,
  `quantity` bigint DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `archive3_d_model` longtext,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_componentes_molde_codigo` (`molde_codigo`),
  CONSTRAINT `fk_componentes_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_processos_molde_codigo` (`molde_codigo`),
  KEY `idx_processos_componentes_id` (`componentes_id`),
  KEY `idx_processos_maquina_id` (`maquina_id`),
  CONSTRAINT `fk_processos_componente` FOREIGN KEY (`componentes_id`) REFERENCES `componentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_processos_maquina` FOREIGN KEY (`maquina_id`) REFERENCES `maquinas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_processos_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: programacoes
CREATE TABLE `programacoes` (
  `id` varchar(12) NOT NULL,
  `molde_codigo` varchar(12) DEFAULT NULL,
  `componentes_id` varchar(12) DEFAULT NULL,
  `maquina_id` varchar(12) DEFAULT NULL,
  `step` longtext,
  `description` longtext,
  `date` datetime(3) DEFAULT NULL,
  `programmer` longtext,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_programacoes_maquina_id` (`maquina_id`),
  KEY `idx_programacoes_molde_codigo` (`molde_codigo`),
  KEY `idx_programacoes_componentes_id` (`componentes_id`),
  CONSTRAINT `fk_programacoes_componentes` FOREIGN KEY (`componentes_id`) REFERENCES `componentes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_programacoes_maquina` FOREIGN KEY (`maquina_id`) REFERENCES `maquinas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_programacoes_molde` FOREIGN KEY (`molde_codigo`) REFERENCES `moldes` (`codigo`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
