/**
 * letomap地图相关
 * 定义命名空间
 */
var com
if (!com) com = {}
if (!com.leto) com.leto = {}
if (!com.leto.map) com.leto.map = {}
if (!com.leto.map.config) com.leto.map.config = {}

/**
 * 主机地址
 *
 * @const
 * @type {string}
 */
// com.leto.map.config.HOST_URL = 'http://14.29.69.132:8888'
com.leto.map.config.HOST_URL = 'http://192.168.1.166:8080'

/**
 * 地市边界url
 * 
 */
com.leto.map.config.REGION_BOUNDARY_URL = 'http://192.168.1.166:8983/solr/workgrid/select'


// 国家站点url
com.leto.map.config.COUNTRY_STATION_URL = 'http://192.168.1.166:8983/solr/surfstation/select';


// 站点url
com.leto.map.config.STATION_URL = 'http://192.168.1.166:8983/solr/poi/select';



/**
 * 矢量数据url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.VECTOR_DATA_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/getPoiInfos.do'

/**
 * 显示信息点名称地图级别
 *
 * @const
 * @type {number}
 */
com.leto.map.config.SHOW_INFOPOINT_ZOOM = 20

/**
 * 显示工作网格拾取的地图级别
 *
 * @const
 * @type {number}
 */
com.leto.map.config.SHOW_WORKGRID_PICK_ZOOM = 16

/**
 * 查询图层url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.SEARCH_LAYER_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/getSearchLayerInfo.do'

/**
 * 建议结果url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.SUGGEST_RESULT_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/getSuggestResult.do'

/**
 * 搜索结果url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.SEARCH_RESULT_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/getSearchResult.do'

/**
 * 修改矢量数据url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.UPDATE_VECTORDATA_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/saveDataVo.do'

/**
 * 矢量数据图层菜单url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.DATAVECTOR_LAYER_MENU_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/getDataManagerLayerInfo.do'

/**
 * 矢量数据图层子菜单url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.DATAVECTOR_LAYER_SUBMENU_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/getLayerDataTypeInfo.do'

/**
 * 矢量数据保存信息点url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.DATAVECTOR_INFOPOINT_SAVE_URL = com.leto.map.config.HOST_URL + '/agros/gisplatform/saveDataVo.do'

/**
 * 快速定位菜单url
 *
 * @const
 * @type {string}
 */
com.leto.map.config.QUICKPOSITION_MENU_URL = 'http://14.29.69.132:8888/solr/workgrid/select'
