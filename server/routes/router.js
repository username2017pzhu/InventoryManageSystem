const express = require('express');
const router = express.Router();
const employee = require('../api/employee')
const supplier = require('../api/supplier')
const goods = require('../api/goods')
const types =require('../api/types')
const stock = require('../api/stock')
const stockSum=require('../api/stockSum')
const stockReturn=require('../api/stockReturn')
const sales =require('../api/sales')
const salesSum =require('../api/salesSum')
const salesReturn=require('../api/salesReturn')
const inventory=require('../api/inventory')
const admin=require('../api/admin')
const goodsSalesSum=require('../api/goodsSalesSum')
// 员工
router.post('/employee/add', employee.add)
router.get('/employee/queryAll', employee.queryAll)
router.post('/employee/del', employee.del)
router.post('/employee/multiDel', employee.multiDel)
router.post('/employee/queryByName', employee.queryByName)
router.post('/employee/update', employee.update)
router.post('/employee/pagination',employee.pagination)

// supplier
router.post('/supplier/add', supplier.add)
router.get('/supplier/queryAll', supplier.queryAll)
router.get('/supplier/queryUsedSup', supplier.queryUsedSup)
router.post('/supplier/del', supplier.del)
router.post('/supplier/multiDel', supplier.multiDel)
router.post('/supplier/multiStateChange', supplier.multiStateChange)
router.post('/supplier/queryByName', supplier.queryByName)
router.post('/supplier/update', supplier.update)
router.post('/supplier/stateChange', supplier.stateChange)
router.post('/supplier/pagination',supplier.pagination)

// goods
router.post('/goods/add', goods.add)
router.get('/goods/queryAll',goods.queryAll)
router.get('/goods/queryUsedGoods', goods.queryUsedGoods)
router.post('/goods/del', goods.del)
router.post('/goods/multiDel', goods.multiDel)
router.post('/goods/multiStateChange', goods.multiStateChange)
router.post('/goods/queryByName', goods.queryByName)
router.post('/goods/queryById', goods.queryById)
router.post('/goods/update', goods.update)
router.post('/goods/stateChange', goods.stateChange)
router.post('/goods/pagination',goods.pagination)

// types
router.post('/types/add', types.add)
router.get('/types/queryAll', types.queryAll)
router.get('/types/queryUsedTypes', types.queryUsedTypes)
router.post('/types/del', types.del)
router.post('/types/multiDel', types.multiDel)
router.post('/types/multiStateChange', types.multiStateChange)
router.post('/types/update', types.update)
router.post('/types/stateChange', types.stateChange)

// stock
router.get('/stock/queryAll', stock.queryAll)
router.post('/stock/add', stock.add)
router.post('/stock/update',stock.update)
router.post('/stock/queryByName', stock.queryByName)
router.post('/stock/queryFetch', stock.queryFetch)


// stockSum
router.get('/stockSum/queryAll', stockSum.queryAll)
router.post('/stockSum/add',stockSum.add)
router.post('/stockSum/update',stockSum.update)
router.post('/stockSum/queryByName',stockSum.queryByName)
router.post('/stockSum/stateChange',stockSum.stateChange)
router.post('/stockSum/multiStateChange',stockSum.multiStateChange)
router.post('/stockSum/pagination',stockSum.pagination)



// stockReturn
router.get('/stockReturn/queryAll', stockReturn.queryAll)
router.post('/stockReturn/add',stockReturn.add)
router.post('/stockReturn/del',stockReturn.del)
router.post('/stockReturn/queryByName',stockReturn.queryByName)
router.post('/stockReturn/stateChange',stockReturn.stateChange)
router.post('/stockReturn/multiStateChange',stockReturn.multiStateChange)
router.post('/stockReturn/pagination',stockReturn.pagination)

// sales
router.post('/sales/add', sales.add)
router.post('/sales/del', sales.del)
router.post('/sales/multiDel', sales.multiDel)
router.post('/sales/queryFetch', sales.queryFetch)

// salesSum
router.get('/salesSum/queryAll', salesSum.queryAll)
router.get('/salesSum/queryCompleted', salesSum.queryCompleted)
router.post('/salesSum/stateChange',salesSum.stateChange)
router.post('/salesSum/multiStateChange',salesSum.multiStateChange)
router.get('/salesSum/profitAn',salesSum.profitAn)
router.get('/salesSum/today', salesSum.today)
router.get('/salesSum/yesterday', salesSum.yesterday)
router.get('/salesSum/lastWeek', salesSum.lastWeek)
router.get('/salesSum/lastMonth', salesSum.lastMonth)
router.get('/salesSum/empSalesAn',salesSum.empSalesAn)
router.post('/salesSum/add',salesSum.add)
router.post('/salesSum/update',salesSum.update)
router.post('/salesSum/queryByName',salesSum.queryByName)
router.post('/stockSum/pagination',stockSum.pagination)

// salesReturn
router.get('/salesReturn/queryAll', salesReturn.queryAll)
router.post('/salesReturn/add',salesReturn.add)
router.post('/salesReturn/queryByName',salesReturn.queryByName)
router.post('/salesReturn/pagination',salesReturn.pagination)
router.post('/salesReturn/stateChange',salesReturn.stateChange)
//goodsSalesSum
router.post('/goodsSalesSum/add',goodsSalesSum.add)
router.post('/goodsSalesSum/update',goodsSalesSum.update)
router.post('/goodsSalesSum/queryById',goodsSalesSum.queryById)
router.get('/goodsSalesSum/queryAll',goodsSalesSum.queryAll)

// invetory
router.post('/inventory/add', inventory.add)
router.get('/inventory/queryAll', inventory.queryAll)
router.post('/inventory/queryById', inventory.queryById)
router.post('/inventory/update', inventory.update)
router.post('/inventory/queryByName', inventory.queryByName)
router.post('/inventory/pagination',inventory.pagination)

//admin
router.get('/admin/queryAll',admin.queryAll)
router.post('/admin/queryName',admin.queryName)
router.post('/admin/login',admin.login)
router.post('/admin/loginCheck',admin.loginCheck)
router.post('/admin/register',admin.register)
router.post('/admin/updateToken',admin.updateToken)
router.post('/admin/updateUserToken',admin.updateUserToken)
router.post('/admin/updateRole',admin.updateRole)
router.post('/admin/update',admin.update)
module.exports = router;
