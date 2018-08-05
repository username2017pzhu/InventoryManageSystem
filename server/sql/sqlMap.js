const sqlMap = {
	admin_info:{
		queryAll:`select * from admin_info`,
		login:`select * from admin_info where admName=?`,
		loginCheck:`select token from admin_info where admName=?`,
		register:`insert into admin_info values (0,?,?,?,?,?,?)`,
		queryName:`select admName from admin_info where admName=?`,
		update:`update admin_info set admName=?,admPassword=?,admEditTime=?,token=? where admName=?`,
		updateToken:`update admin_info set token=? where admName=?`,
		updateRole:`update admin_info set role=? where admName=?`
	},
	employee_info: {
			add: `insert into employee_info
			(empNo,empName,empAge,empSex,empBirthday,empIdCard,empTel,empQQ,empAddress,empEntryDate,empState)
			 values (0,?,?,?,?,?,?,?,?,?,'就职')`,
			queryAll:`select * from employee_info`,
			queryByName:`select * from employee_info where empNo=? or empName like ?`,
			del:`delete from employee_info where empNo=?`,
			multiDel:`delete from employee_info where empNo in (?)`,
			update:`update employee_info set 
			empName=?,empAge=?,empSex=?,empBirthday=?,empIdCard=?,empTel=?,empQQ=?,empAddress=?,empEntryDate=? 
			where empNo=?`,
			pagination:`select * from employee_info limit ?,10`
	},
	supplier_info:{
			add:`insert into supplier_info 
			(supNo,supName,supLawyer,supTel,supAddress,supState) 
			values (0,?,?,?,?,'已启用')`,
			queryAll:`select * from supplier_info`,
			queryUsedSup:`select supName from supplier_info where supState='已启用'`,
			queryByName:`select * from supplier_info where supNo= ? or supName like ?`,
			del:`delete from supplier_info where supNo=?`,
			multiDel:`delete from supplier_info where supNo in (?)`,
			multiStateChange:`update supplier_info set supState=? where supNo in (?)`,
			update:`update supplier_info set supName=?,supLawyer=?,supTel=?,supAddress=? where supNo=?`,
			stateChange:`update supplier_info set supState=? where supNo=?`,
			pagination:`select * from supplier_info limit ?,10`
	},
	goods_info:{
			add: `insert into goods_info
			values (0,?,?,?,?,?,?,?,?,?,'已上架')`,
			queryAll:`select * from goods_info`,
			queryUsedGoods:`select goodsNo,goodsName,stockPrice,goodsPrice,supName from goods_info where goodsState='已上架'`,
			queryByName:`select * from goods_info where goodsNo= ? or goodsName like ? or goodsType like ?`,
			queryById:`select goodsNo,goodsName,stockPrice,goodsPrice from goods_info where goodsNo=?`,
			del:`delete from goods_info where goodsNo=?`,
			multiDel:`delete from goods_info where goodsNo in (?)`,
			multiStateChange:`update goods_info set goodsState=? where goodsNo in (?)`,
			update:`update goods_info set goodsName=?,
			goodsType=?,goodsUnit=?,goodsModel=?,goodsSpec=?,stockPrice=?,goodsPrice=?,supName=?,goodsAddTime=? where goodsNo=?`,
			stateChange:`update goods_info set goodsState=? where goodsNo=?`,
			pagination:`select * from goods_info limit ?,10`
	},
	types:{
			add: `insert into types
			values (0,?,?,'已启用')`,
			queryAll:`select * from types`,
			queryUsedTypes:`select goodsType from types where goodsTypeState='已启用'`,
			del:`delete from types where goodsTypeNo=?`,
			multiDel:`delete from types where goodsTypeNo in (?)`,
			multiStateChange:`update types set goodsTypeState=? where goodsTypeNo in (?)`,
			update:`update types set goodsType=? where goodsTypeNo=?`,
			stateChange:`update types set goodsTypeState=? where goodsTypeNo=?`,
	},
	stock:{
		add:`insert into stock
		values (0,?,?,?,?,?,?,?,?)`,
		update:`update stock set stockCount=?,stockMoney=? where goodsNo=?`,
		queryAll:`select 
		b.stockNo,b.goodsNo,b.goodsName,b.supName,b.stockPrice,b.goodsPrice,b.stockCount,b.stockMoney,
		a.stockAddTime,a.stockState from stock_summary a join stock b on a.stockNo=b.stockNo`,
		queryByName:`select 
		b.stockNo,b.goodsNo,b.goodsName,b.supName,b.goodsPrice,b.stockCount,b.stockMoney,
		a.stockAddTime,a.stockState from stock_summary a join stock b on a.stockNo=b.stockNo where a.stockNo=? or a.stockAddTime like ?`,
		queryFetch:`select * from stock where stockNo=?`,
	},
	stock_summary:{
		add:`insert into stock_summary values( 0,?,?,?,?,'待审核')`,
		update:`update stock_summary set stockCountSum=?,stockMoneySum=? where stockNo=?`,
		queryAll:`select * from stock_summary`,
		queryByName:`select * from stock_summary where stockNo= ? or stockAddTime like?`,
		stateChange:`update stock_summary set stockState=? where stockNo=?`,
		multiStateChange:`update stock_summary set stockState=? where stockNo in (?)`,
		pagination:`select * from stock_summary limit ?,8 `,
	},
	stock_return:{
		add:`insert into stock_return values (0,?,?,?,?,?,?,?,'待审核')`,
		del:`delete from stock_return where returnStockNo=?`,
		queryAll:`select * from stock_return`,
		queryByName:`select * from stock_return where returnStockNo= ? or returnAddTime like?`,
		stateChange:`update stock_return set returnStockState=? where returnStockNo=?`,
		multiStateChange:`update stock_return set returnStockState=? where returnStockNo in (?)`,
		pagination:`select * from stock_return limit ?,10`
	},
	sales:{
		add:`insert into sales values (0,?,?,?,?,?,?,?)`,
		queryFetch:`select * from sales where salesNo=?`,
		del:`delete from sales where salesNo=? `,
		multiDel:`delete from sales where salesNo in(?)`
	},
	sales_summary:{
		add:`insert into sales_summary values(0,?,?,?,?,?,?,?,'已完成',?)`,
		queryAll:`select * from sales_summary`,
		queryCompleted:`select * from sales_summary where salesState='已完成'`,
		update:`update sales_summary set salesMoneySum=?,salesProfitSum=? where salesNo=?`,
		stateChange:`update sales_summary set salesState='已删除' where salesNo=?`,
		multiStateChange:`update sales_summary set salesState='已删除' where salesNo in(?)`,
		queryByName:`select * from sales_summary where salesNo= ? or salesAddTime like?`,
		pagination:`select * from sales_summary limit ?,10`,
		today:`select * from sales_summary where to_days(salesAddTime) = to_days(now())`,
		yesterday:`SELECT * FROM sales_summary WHERE TO_DAYS( NOW( ) ) - TO_DAYS( salesAddTime)<=1 and TO_DAYS( NOW( ) ) - TO_DAYS( salesAddTime)>0`,
		lastWeek:`SELECT * FROM sales_summary WHERE YEARWEEK(date_format(salesAddTime,'%Y-%m-%d')) = YEARWEEK(now())-1;`,
		lastMonth:`SELECT * FROM sales_summary WHERE PERIOD_DIFF( date_format( now( ) , '%Y%m' ) , date_format( salesAddTime, '%Y%m' ) ) =1`,
		profitAn:`select  
		month(salesAddTime) month,  
		sum(salesMoneySum) totalSales ,
		sum(salesProfitSum) totalProfit 
		from sales_summary  
		group by year(salesAddTime),  
		month(salesAddTime)  
		`,
		empSalesAn:`select 
		editor,
		sum(salesMoneySum) totalSales,date_format(salesAddTime,'%m') month
		 from sales_summary 
		 group by date_format(salesAddTime,'%m'),editor`
	},
	goods_sales_summary:{
		add:`insert into goods_sales_summary values(0,?,?,?,?,?,?,?)`,
		update:`update goods_sales_summary set salesCount=?,salesMoney=?,salesProfit=? where goodsNo=?`,
		queryAll:`select * from goods_sales_summary`,
		queryById:`select * from goods_sales_summary where goodsNo=?`
	},
	sales_return:{
		add:`insert into sales_return values (0,?,?,?,?,?,?,?,?,'待审核')`,
		queryAll:`select * from sales_return`,
		stateChange:`update sales_return set returnState='已完成' where returnGoodsNo=?`,
		queryByName:`select * from sales_return where returnGoodsNo= ? or returnAddTime like?`,
		pagination:`select * from sales_return limit ?,10`
	},
	inventory:{
		add:`insert ignore into inventory (goodsNo,goodsName,goodsInv) values ?`,
		queryAll:`select * from inventory`,
		queryById:`select goodsInv from inventory where goodsNo=?`,
		queryByName:`select * from inventory where goodsNo=? or goodsName like ?`,
		update:`update inventory set goodsInv=? where goodsNo=?`,
		pagination:`select * from inventory limit ?,10`,
	}


}
module.exports = sqlMap;