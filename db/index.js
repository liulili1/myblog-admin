const mysql  = require('mysql');
const { host, user, password, database } = require('./config');
const {debug} = require('../utils/constant')
const { isObject} = require('../utils')

function connect() {
  return  mysql.createConnection({
      host     : host,
      user     : user,
      password : password,
      database : database,
      charset: 'utf8mb4'
    });
}



function queryOne (sql) {
  const con = connect();
  return new Promise((resolve, reject) => {
    try {
      con.query(sql, (err, result) => {
        if(err) {
          debug && console.log(`查询失败: ${sql}`);
          reject(err)
        }else {
          debug && console.log(`查询成功: ${sql} result: ${result}`);
          resolve(result)
        }
      })
    } catch (error) {
      reject(error)
    } finally {
      con.end()
    }
  })
}
function insert(model, tableName) {
  const conn = connect()
  return new Promise((resolve, reject) => {
      try {
        let keys = []
        let values = []
        // console.log('model',model);
        Object.keys(model).forEach((key)=> {
            //判断key 是不是 model自身的属性，派出父类的属性
            if(model.hasOwnProperty(key)&& model[key]) {
                  keys.push(`\`${key}\``)
                  values.push(`'${model[key]}'`)
                
            }
        })
       
        if(keys.length > 0 && values.length > 0) {
            let sql = `INSERT INTO \`${tableName}\`(`
            const keyString = keys.join(',')
            const valueString = values.join(',')
            sql = `${sql}${keyString}) VALUES (${valueString})`
            debug && console.log(sql);
            conn.query(sql, (err, result) => {
                if(err) {
                    reject(err)
                }else {
                    resolve(result)
                }
            })
        }else {
            reject(new Error('传入的对象属性不存在'))
        }
      } catch (error) {
          reject(error)
      } finally {
          conn.end()
      }
  })
}
function update(model, tableName) {
  const conn = new connect()
   return new Promise((resolve, reject) => {
       try {
           if(!isObject(model)) {
               reject(new Error('传入的参数不合法'))
           }else {
               const id = model.id
               if(!id) {
                   reject(new Error('id 不能为空'))
               }
               let sql = `update ${tableName} set `
               let params = []
               Object.keys(model).forEach(key => {
                   if(model[key]) {
                       params.push(`\`${key}\` = '${model[key]}'`)
                   }
               })
               sql = `${sql}${params.join(',')} where id = ${id}`
               debug && console.log(sql);
               conn.query(sql, (err, result) => {
                   if(err) {
                       reject(err)
                   }else {
                       resolve(result)
                   }
               })
   
           }
       } catch (error) {
           reject(error)
       } finally {
           conn.end()
       }
   })
}
function querySql(sql) {
  let conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, result) => {
        if(err){
          reject(err)
        }
        debug && console.log(sql);
        resolve(result)
      })
    } catch (error) {
      reject(error)
    } finally {
      conn.end()
    }
  })
}
function deleteOne(sql) {
  let conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn
    } catch (error) {
      
    }
  })
}
function andSql(where, k, v, tableName) {
  if(where === 'where'){
    return `${where} ${tableName}.${k} = '${v}'`
  } else {
    return  `${where} and ${tableName}.${k} = '${v}'`
  }
}
function likeSql(where, k, v, tableName) {
  if(where === 'where'){
    return `${where} ${tableName}.${k} like '%${v}%'`
  } else {
    return  `${where} and ${tableName}.${k} like '%${v}%'`
  }
}
module.exports = {
  queryOne,
  insert,
  querySql,
  deleteOne,
  andSql,
  likeSql,
  update
}