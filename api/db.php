<?php

class DB {

    private $pdo_o;

    function __construct($settings_a) {

        $dsn_s = 'mysql:host=' . $settings_a['host'] . ';dbname=' . $settings_a['db'] . ';charset=' . $settings_a['charset'];
        $options_a = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ];
        try {
             $this->pdo_o = new PDO($dsn_s, $settings_a['user'], $settings_a['password'], $options_a);
        } catch (\PDOException $error_o) {
             throw new \PDOException($error_o->getMessage(), (int)$error_o->getCode());
        }
    }

    public function select($table_s, $params_a) {

        $result_o = new stdClass();

        try {

            $whereClause_a = [];

            foreach($params_a as $columnName_s => $value_s) {

                array_push($whereClause_a, $table_s . '.' . $columnName_s . ' = ' . ':' .  $columnName_s);
            }

            $whereClause_s = implode(' AND ', $whereClause_a);
            
            $sql_s = "SELECT * FROM " . $table_s . " WHERE " . $whereClause_s;
           
            $stmt_o = $this->pdo_o->prepare($sql_s);

            $stmt_o->execute($params_a);

            $data_a = [];

            while($row_o = $stmt_o->fetch()) {

                array_push($data_a, $row_o);
            }

            $result_o->{'result'} = 'ok';
            $result_o->{'data'} = $data_a;

            return $result_o;

        } catch(Exception $e) {

            $result_o->{'result'} = 'error';
            $result_o->{'message'} = $e->getMessage();

            return $result_o;
        }
    }

    public function insertInto($table_s, $params_a) {

        $result_o = new stdClass();

        try {

            $columnNames_a = array_keys($params_a);
            
            $sql_s = "INSERT INTO " . $table_s . "(" . implode(', ', $columnNames_a) . ") "
                   . "VALUES (:" . implode(', :', $columnNames_a) . ")";

            $stmt_o = $this->pdo_o->prepare($sql_s);

            $stmt_o->execute($params_a);

        } catch(Exception $e) {

            $result_o->{'result'} = 'error';
            $result_o->{'message'} = $e->getMessage();

            return $result_o;
        }

        $data_o = new stdClass();
        $data_o->{'id'} = $this->pdo_o->lastInsertId();

        $result_o->{'result'} = 'ok';
        $result_o->{'data'} = $data_o;

        return $result_o;
    }

    public function addSchedule($params_a) {

        try {

            $sql_s = "INSERT INTO schedule(from_datetime, to_datetime) "
                   . "VALUES (:from_datetime, :to_datetime)";

            $stmt_o = $this->pdo_o->prepare($sql_s);

            $stmt_o->execute($params_a);

        } catch(Exception $e) {

            return $e->getMessage();
        }

        return $this->pdo_o->lastInsertId();
    }

    /**
     * Adds a new row in the ads table
     * 
     * @param array $params_aa
     * 
     * @return array $params_aa
     * 
     */
    public function add($params_aa) {

        $errors_aa = $this->validate($params_aa);
        if(!empty($errors_aa)) {
            $response_aa['status'] = 'error';
            $response_aa['errors'] = $errors_aa;
            return $response_aa;
        }
        try {
            $sql_s = "INSERT INTO ads(type, category, county, header, body, price, email, image, published, uuid) "
            . "VALUES (:type, :category, :county, :header, :body, :price, :email, :image, :published, :uuid)";
            $stmt_o = $this->pdo_o->prepare($sql_s);
            $stmt_o->execute($params_aa);
        } catch(Exception $e) {
            $error_aa = [
                'status'  => 'error',
                'message' => $e->getMessage()
            ];
            return $error_aa;
        }
        $response_aa = [
            'status'       => 'success',
            'id' => $this->pdo_o->lastInsertId()
        ];
        return $response_aa;
    }

    public function deleteAd($uuid) {

        $sql_s = "SELECT ads.id, ads.image, ads.header FROM ads WHERE ads.uuid = :uuid";
        $stmt_o = $this->pdo_o->prepare($sql_s);
        $stmt_o->execute(['uuid' => $uuid]);
        $ad_aa = $stmt_o->fetch();
        if(empty($ad_aa)) {
            return '';
        }
        $sql_s = "DELETE FROM ads WHERE ads.uuid = :uuid";
        $stmt_o = $this->pdo_o->prepare($sql_s);
        $stmt_o->execute(['uuid' => $uuid]);
        if($ad_aa['image'] !== 'no image') {
            $fileName_s = $ad_aa['id'] . '.' . $ad_aa['image'];
            unlink('./uploads/' . $fileName_s);
        }
        return $ad_aa['header'];
    }

    /**
     * Fetch a row from the ads table.
     * 
     * @param integer $id_i
     * 
     * @return array $params_aa
     * 
     */
    public function fetchAd($id_i) {

        try {
            $sql_s = "SELECT * FROM ads WHERE ads.id = :id";
            $stmt_o = $this->pdo_o->prepare($sql_s);
            $stmt_o->execute(['id' => $id_i]);
        } catch(Exception $e) {
            $error_aa = [
                'status'  => 'error',
                'message' => $e->getMessage()
            ];
            return $error_aa;
        }
        return $stmt_o->fetch();
        $response_aa = [
            'status'       => 'success',
            'id' => $this->pdo_o->lastInsertId()
        ];
        return $response_aa;
    }

    /**
     * Fetch all categories from the database table "category"
     * 
     * @return array 
     */
    public function fetchCategories() {

        $sql_s = "SELECT * FROM category";
        $stmt_o = $this->pdo_o->prepare($sql_s);
        $stmt_o->execute();
        $queryResult_ao = [];
        while($row_o = $stmt_o->fetch()) {
            array_push($queryResult_ao, $row_o);
        }
        return $queryResult_ao;
    }

    /**
     * Fetch all counties from the database table "county"
     * 
     * @return array 
     */
    public function fetchCounties() {

        $sql_s = "SELECT * FROM county";
        $stmt_o = $this->pdo_o->prepare($sql_s);
        $stmt_o->execute();
        $queryResult_ao = [];
        while($row_o = $stmt_o->fetch()) {
            array_push($queryResult_ao, $row_o);
        }
        return $queryResult_ao;
    }

    /**
     * Validate all parameters
     * 
     * @param array $params_aa
     * 
     * @return array
     */
    private function validate($params_aa) {

        $errors_aa = array();
        foreach($params_aa as $key_s => $value_s) {
            switch($key_s) {
                case 'body':
                    $numOfChars_i = strlen($value_s);
                    if($numOfChars_i < 1 || $numOfChars_i > 400) {
                        $errors_aa['body'] = true;
                    }
                    break;
                case 'header':
                    $numOfChars_i = strlen($value_s);
                    if($numOfChars_i < 1 || $numOfChars_i > 100) {
                        $errors_aa['header'] = true;
                    }
                    break;
                case 'price':
                    if(!is_numeric($value_s) || strlen($value_s) > 10) {
                        $errors_aa['price'] = true;
                    }
                    break;
                case 'category':
                    if(!is_numeric($value_s) || $value_s < 1 || $value_s > 33) {
                        $errors_aa['category'] = true;
                    }
                    break;
                case 'county':
                    if(!is_numeric($value_s) || $value_s < 1 || $value_s > 23) {
                        $errors_aa['county'] = true;
                    }
                    break;
                case 'email':
                    if(strlen($value_s) > 50 || !filter_var($value_s, FILTER_VALIDATE_EMAIL)) {
                        $errors_aa['email'] = true;
                    }
                    break;
                case 'phone':
                    if(strlen($value_s) > 20) {
                        $errors_aa['phone'] = true;
                    }
                    break;
                case 'type':
                    if($value_s < 1 || $value_s > 3) {
                        $errors_aa['type'] = true;
                    }
            }
        }
        return $errors_aa;
    }

    public function search($params_o) {

        $sql_s = "SELECT id, type, category, county, header, body, price, image, published FROM ads";
        $and_s = " WHERE";
        $placeholders_a = [];
        if($params_o->category !== '0') {
            $sql_s .= $and_s . " category = :category";
            $and_s = " AND";
            $this->array_push_assoc($placeholders_a, 'category', $params_o->category);
        }
        if($params_o->type !== '0') {
            $sql_s .= $and_s . " type = :type";
            $and_s = " AND";
            $this->array_push_assoc($placeholders_a, 'type', $params_o->type);
        }
        if($params_o->county !== '0') {
            $sql_s .= $and_s . " county = :county";
            $and_s = " AND";
            $this->array_push_assoc($placeholders_a, 'county', $params_o->county);
        }
        if($params_o->text !== '') {
            $sql_s .= $and_s . " (body LIKE :body OR header LIKE :header)";
            $this->array_push_assoc($placeholders_a, 'body', "%$params_o->text%");
            $this->array_push_assoc($placeholders_a, 'header', "%$params_o->text%");
        }
        $sql_s .= " ORDER BY published DESC";
        file_put_contents('./debug.txt', $sql_s);
        $stmt_o = $this->pdo_o->prepare($sql_s);
        $stmt_o->execute($placeholders_a);
        $queryResult_s = '';
        $queryResult_a = [];
        while($row_o = $stmt_o->fetch()) {
            array_push($queryResult_a, $row_o);
        }
        return $queryResult_a;
    }

    private function array_push_assoc(&$array, $key, $value) {

        $array[$key] = $value;
        return $array;
    }
}