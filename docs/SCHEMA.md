# JES Employee System — Sheet Schema v0.1

## Employees
| Column        | Type      | Description                     |
|----------------|-----------|---------------------------------|
| timestamp      | datetime  | Row creation time               |
| jes_id         | string    | Unique JES identifier           |
| etunimi        | string    | First name                      |
| sukunimi       | string    | Last name                       |
| sahkoposti     | string    | Email address                   |
| puhelin        | string    | Phone number                    |
| osoite         | string    | Street address                  |
| postinumero    | string    | Postal code                     |
| kaupunki       | string    | City                            |
| veroprosentti  | number    | Tax percentage (0–60)           |
| created_by     | string    | Google account that added entry |

## PII_Employees
| Column       | Type      | Description           |
|---------------|-----------|-----------------------|
| timestamp     | datetime  | Creation time         |
| jes_id        | string    | Foreign key to main   |
| henkilotunnus | string    | Finnish ID number     |
| iban          | string    | Bank account (FI…)    |

## AuditLog
| Column     | Type      | Description                    |
|-------------|-----------|--------------------------------|
| timestamp   | datetime  | When action happened           |
| actor       | string    | Who performed it               |
| action      | string    | Operation type                 |
| jes_id      | string    | Related employee id            |
| details     | string    | Brief text, no PII             |
