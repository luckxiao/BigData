	    function searchTreeNode(treeID,searchText){
			    //easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法\
				var tree = $('#'+treeID);
				//获取所有的树节点
				var nodeList = getAllNodes(tree);
		  		//如果没有搜索条件，则展示所有树节点
				searchText = $.trim(searchText);
		  		if (searchText == "") {
		  			for (var i=0; i<nodeList.length; i++) {
		  				$(".tree-node-search", nodeList[i].target).removeClass("tree-node-search");
		  	  			$(nodeList[i].target).show();
		  	  		}
		  			//展开已选择的节点（如果之前选择了）
		  			var selectedNode = tree.tree('getSelected');
		  			if (selectedNode) {
		  				tree.tree('expandTo',selectedNode.target);
		  			}
		  			return;
		  		}
		  		
		  		//搜索匹配的节点并高亮显示
		  		var matchedNodeList = [];
		  		if (nodeList && nodeList.length>0) {
		  			var node = null;
		  			for (var i=0; i<nodeList.length; i++) {
		  				node = nodeList[i];
		  				if (isMatch(searchText, node.text)) {
		  					matchedNodeList.push(node);
		  				}
		  			}
		  			//隐藏所有节点
		  	  		for (var i=0; i<nodeList.length; i++) {
		  	  			$(".tree-node-search", nodeList[i].target).removeClass("tree-node-search");
		  	  			$(nodeList[i].target).hide();
		  	  		}  			
		  			
		  			//折叠所有节点
		  	  		//tree.collapseAll(jqTree);
		  			//展示所有匹配的节点以及父节点  			
		  			for (var i=0; i<matchedNodeList.length; i++) {
		  				showMatchedNode(tree, matchedNodeList[i]);
		  			}
		  		} 	 
		}
		
		
		/**
		 * 展示搜索匹配的节点
		 */
		function showMatchedNode(tree, node) {
	  		//展示所有父节点
	  		$(node.target).show();
	  		$(".tree-title", node.target).addClass("tree-node-search");
	  		var pNode = node;
	  		while ((pNode = tree.tree('getParent',pNode.target))) {
	  			$(pNode.target).show();  			
	  		}
	  		//展开到该节点
	  		tree.tree('expandTo',node.target);
	  		//展示子节点
	  		
	  		var children = tree.tree('getChildren',node.target);
					if (children && children.length>0) {
						for (var i=0; i<children.length; i++) {
							if ($(children[i].target).is(":hidden")) {
								$(children[i].target).show();
							}
						}
					}
	  		
	  		//如果是非叶子节点，需折叠该节点的所有子节点
	  		if (!tree.tree('isLeaf',node.target)) {
	  			tree.tree('collapse',node.target);
	  		}  
	  	}  	 
		
		/**
		 * 判断searchText是否与targetText匹配
		 * @param searchText 检索的文本
		 * @param targetText 目标文本
		 * @return true-检索的文本与目标文本匹配；否则为false.
		 */
		function isMatch(searchText, targetText) {
	  		return $.trim(targetText)!="" && targetText.indexOf(searchText)!=-1;
	  	}
		
		/**
		 * 获取easyui tree的所有node节点
		 */
		function getAllNodes(tree) {
			var roots = tree.tree('getRoots');
	  		allNodeList = getChildNodeList(tree, roots);
				
			
	  		return allNodeList;
	  	}
	  	
		/**
		 * 定义获取easyui tree的子节点的递归算法
		 */
	  	function getChildNodeList(tree, nodes) {
	  		var childNodeList = [];
	  		if (nodes && nodes.length>0) {  			
	  			var node = null;
	  			for (var i=0; i<nodes.length; i++) {
	  				node = nodes[i];
	  				childNodeList.push(node);
	  				if (!tree.tree('isLeaf',node.target)) {
	  					var children = tree.tree('getChildren',node.target);
	  					childNodeList = childNodeList.concat(getChildNodeList(tree, children));
	  				}
	  			}
	  		}
	  		return childNodeList;
	  	}