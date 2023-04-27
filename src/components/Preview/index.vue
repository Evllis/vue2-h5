<template>
    <div class="preview-component">
        <div class="preview-component__body">
            <h1 class="text-center mb-20px">客户服务协议</h1>
            <div class="mb-15px">
                <p class="flex justify-end">
                    编号：【<span class="text-underline">{{ formData.contractCode || '' }}</span
                    >】
                </p>
            </div>
            <div class="mb-24px">
                <p>
                    甲方（需方）：<span class="text-underline">{{ formData.enterpriseName || '' }}</span>
                </p>
                <p>甲方（公章/合同章）：</p>
                <p>
                    日期：<span class="text-underline">{{ formData.contractTime || '' }}</span>
                </p>
            </div>
            <div class="mb-24px">
                <p>乙方（供方）：北京天安未来科技有限公司</p>
                <p>乙方（公章/合同章）：</p>
                <p>
                    日期：<span class="text-underline">{{ formData.contractTime || '' }}</span>
                </p>
            </div>
            <div class="mb-50px">
                <p class="indent-lv1">
                    甲方根据与中国联合网络通信有限公司【<span class="text-underline">{{
                        formData.unicomCity || ''
                    }}</span
                    >】分公司（以下简称“【<span class="text-underline">{{ formData.unicomCity || '' }}</span
                    >】联通”）签署的《集团客户服务合同》办理中国联通集团客户业务，并自乙方处购买相关的配套服务包，双方根据《中华人民共和国民法典》相关法律法规，经平等协商，签署本协议。
                </p>
                <dl class="flex items-start font-bold">
                    <dt class="text-label">1</dt>
                    <dd>
                        <p>业务配套服务包采购清单和业务入网清单</p>
                        <p>见附件1和附件2。</p>
                        <p>
                            在业务模式、结算条件和标准与本协议约定内容相同的情况下，甲方分批入网时，双方针对分批入网订单按附件1和2样式更新或者补充附件。更新或者补充的附件为本协议有效组成部分。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start font-bold">
                    <dt class="text-label">2</dt>
                    <dd>
                        <p>付款方式</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">2.1</dt>
                    <dd>
                        <p>
                            2.1甲方办理中国联通集团客户业务，在服务周期内【<span class="text-underline">{{
                                formData.unicomCity || ''
                            }}</span
                            >】联通在甲方按时足额缴纳基础套餐产品费用的情况下向甲方在联通支付有限公司的账户发放在乙方购买使用配套服务包的定向电子券。乙方同意甲方可以使用甲方在联通支付有限公司的账户的定向电子券冲抵货款，甲方同意联通支付有限公司自行执行定向电子券的兑换指令。因甲方未能按时足额缴纳基础套餐产品费用导致中国联通暂停发放定向电子券导致乙方无法使用定向电子券抵扣货款的，甲方应当立即向中国联通付清基础套餐产品费用，以便中国联通向甲方发放定向电子券。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">2.2</dt>
                    <dd>
                        <p>
                            甲方与【<span class="text-underline">{{ formData.unicomCity || '' }}</span
                            >】联通集团客户业务协议有效期内，承诺不申请停机、报停、销号、过户，不变更基础套餐、“配套服务包”内容及货款结算和支付方式等。如因甲方原因导致乙方无法收到电子券冲抵采购货款的，甲方应当在3日内另行以向乙方公司账户转账的方式支付当月货款（乙方账户信息详见2.3），且乙方有权要求甲方提前结清货款。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">2.3</dt>
                    <dd>
                        <p>
                            在合约期内，甲方与乙方协商一致后可以提前结清全部月支付额。提前结清时甲方应付款额为：提前结清项目所涉及剩余合约期内所有月支付金额*（1+【3】%）。甲方需一次性将提前结清款项支付至联通公司，联通公司收到后立即发放等额定向电子券，该定向电子券用于冲抵乙方应收的提前结清款项；或经双方沟通确认后以现金形式一次性将提前结清款项支付至乙方公司账户。
                        </p>
                        <p>乙方账户信息：</p>
                        <p>户名：北京天安未来科技有限公司</p>
                        <p>账号：110926210710701</p>
                        <p>开户行：招商银行股份有限公司北京朝阳门支行</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">2.4</dt>
                    <dd>
                        <p>甲方提前结清的，提前结清项目所对应的服务终止，乙方不再就提前结清的项目提供服务。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">2.5</dt>
                    <dd>
                        <p>
                            除首付款（如有）外，甲方采购的业务配套服务包采购货款按月支付至乙方指定的、在业务办理时指向的乙方电子券账户中，每个月支付金额见附件1所列“月支付金额”。如存在首付款的，甲方应当在乙方发货前支付附件1所列“首付款”。附件1中月支付金额的支付周期为签署之日起甲方采购“业务配套服务包采购清单”最长的承诺在网时长，如存在分批入网的，针对具体采购清单的甲方应付乙方配套服务包（即月支付金额）付款周期为采购服务包对应的合约期。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start font-bold">
                    <dt class="text-label">3</dt>
                    <dd>
                        <p>交货及验收</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">3.1</dt>
                    <dd>
                        <p>
                            乙方依约向甲方提供第一条所述的业务配套服务包。服务包包含终端设备的，需提供三包凭证等配套资料；包含相关服务的，需要提供服务使用的相关配套资料。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">3.2</dt>
                    <dd>
                        <p>收货地址：见附件1</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">3.3</dt>
                    <dd>
                        <p>自甲方验收合格之日起，相关设备的使用风险责任由甲方承担。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">3.4</dt>
                    <dd>
                        <p>
                            甲方在设备验收过程中，应在拆机后进行外观、基本功能等验收，如有异议应当场提出。甲方接收设备终端及三包凭证等配套资料后即完成交货。完成交货后乙方不予退换货。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">3.5</dt>
                    <dd>
                        <p>
                            甲方授权【<span class="text-underline">{{ formData.name || '' }}</span
                            >】为履行本合同代理人，有权接受和签发与本协议相关的各种文件，包括并不限于附件确认、收货单据等。代理人具体信息：姓名【<span
                                class="text-underline"
                                >{{ formData.name || '' }}</span
                            >】，身份证号码【<span class="text-underline">{{ formData.idcard || '' }}</span
                            >】， 联系电话【<span class="text-underline">{{ formData.phone || '' }}</span
                            >】。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start font-bold">
                    <dt class="text-label">4</dt>
                    <dd>
                        <p>甲方的权利义务</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">4.1</dt>
                    <dd>
                        <p>
                            甲方应当当场依约履行终端设备收货、验收义务，否则视为甲方已对终端设备验收合格，且乙方不承担违约责任。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">4.2</dt>
                    <dd>
                        <p>甲方应当按时足额依约支付货款。甲方迟延付款的，每日按采购总价的万分之五支付违约金。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">4.3</dt>
                    <dd>
                        <p>甲方应当严格依照产品说明书等文本使用终端设备，无任何故意损坏后向乙方索赔等不诚信行为。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">4.4</dt>
                    <dd>
                        <p>
                            甲方授权乙方根据甲方所提供的信息（含营业执照、交易信息或其他相关信息等）向合作的第三方查询、核对、收集信息，以综合判断甲方的资信情况，并用于甲方违约情况下的损失款追偿。以上信息的授权仅限于办理本业务以及因本业务发生的相关业务，不管本业务申请是否获批，该授权均持续有效。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">4.5</dt>
                    <dd>
                        <p>
                            有首付款的情况下，移动电话的实际使用人可以代甲方向乙方支付首付款。双方确认联通公司在本协议的代理人可以代乙方向移动电话的实际使用人收取首付款。移动电话的实际使用人未能及时足额代付的，乙方有权向甲方追索。某批采购清单所列全部首付款未付清前，乙方有权暂停发货。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">4.6</dt>
                    <dd>
                        <p>
                            甲方有更换终端设备品牌、型号、配置等需求，进而造成实际终端设备需求与附件1不一致的，须在乙方发货之前沟通，经乙方确认和补齐差价款（如有）后，方可进行更换。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start font-bold">
                    <dt class="text-label">5</dt>
                    <dd>
                        <p>乙方的权利义务</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">5.1</dt>
                    <dd>
                        <p>乙方销售服务包中包含的终端设备应当符合国家相关设备产品标准，符合厂家出厂检验标准。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">5.2</dt>
                    <dd>
                        <p>
                            乙方销售服务包中包含的服务产品，应符合国家相关法律法规的规定，乙方应确保服务期限内按照约定正常持续提供服务。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">5.3</dt>
                    <dd>
                        <p>乙方遵守终端设备三包规定和服务产品使用约定为甲方提供使用和服务保障。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">5.4</dt>
                    <dd>
                        <p>乙方有权收取第二条约定的甲方应付的业务配套服务包采购及使用费用。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">5.5</dt>
                    <dd>
                        <p>乙在合法合规的前提下，可以通过电话、短信、法律诉讼等方式行使对甲方追缴的权利。</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">5.6</dt>
                    <dd>
                        <p>乙方向附件1中月支付金额的现金支付方开具合法发票。</p>
                    </dd>
                </dl>
                <dl class="flex items-start font-bold">
                    <dt class="text-label">6</dt>
                    <dd>
                        <p>其他</p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">6.1</dt>
                    <dd>
                        <p>
                            合作期限有效期的计算。合作期限有限期为：自签署之日起甲方采购“业务配套服务包”最长的承诺在网时长，如存在分批入网的，则以最后一批入网客户的最长承诺在网时长计算。合作期届满前60个工作日内，若甲、乙双方均未有终止协议的书面意思表示，则合作期间将自动延续一年，直至任意一方在合作期届满前60个工作日内以书面解除协议形式通知其他方到期不再续签为止，协议生效起最多延续2次。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">6.2</dt>
                    <dd>
                        <p>
                            合同发生纠纷，甲乙双方应协商解决，也可向有关部门申请调解，协商或者调解不成时约定依法向起诉方所在地的人民法院通过诉讼解决。
                        </p>
                    </dd>
                </dl>
                <dl class="flex items-start indent-lv2">
                    <dt class="text-label">6.3</dt>
                    <dd>
                        <p>
                            本协议一式二份，双方各持一份，自双方加盖相同形式的印章之日起生效。本协议附件为本协议有效组成部分。
                        </p>
                    </dd>
                </dl>
            </div>
            <div class="mb-30px">
                <p>附件1：业务配套服务包采购清单</p>
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th colspan="6" class="font-bold">
                                业务配套服务包采购清单-第<span class="text-underline">{{ formData.batch || '' }}</span
                                >批
                            </th>
                        </tr>
                        <tr>
                            <th>协议编号</th>
                            <th colspan="5">********</th>
                        </tr>
                        <tr>
                            <th>合约期</th>
                            <th>品类</th>
                            <th>数量(台)</th>
                            <th>品牌/型号</th>
                            <th>配置</th>
                            <th width="60">月支付金额(元/月/台)</th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="item of buyListIndex">
                            <tr v-for="(elem, elemIndex) of buyList[item]" :key="elem.id">
                                <td v-if="elemIndex === 0" :rowspan="buyList[item].length">{{ item }}期</td>
                                <td>{{ elem.categoryName || '' }}</td>
                                <td>{{ elem.count || '' }}</td>
                                <td>{{ elem.brand || '' }}</td>
                                <td>{{ elem.dispose || '' }}</td>
                                <td>{{ elem.monthlyPayment || '' }}</td>
                            </tr>
                        </template>
                        <tr>
                            <td colspan="6">
                                <div class="flex items-center justify-center">
                                    <div>
                                        合计台数：<span class="text-underline">{{ formData.countSum || '' }}</span>
                                    </div>
                                    <div class="mx-2">
                                        合计首付款：<span class="text-underline">{{
                                            formData.firstPaymentSum || ''
                                        }}</span>
                                    </div>
                                    <div>
                                        支付款合计：<span class="text-underline">{{
                                            formData.monthlyPaymentSum || ''
                                        }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr class="pure-table-odd">
                            <td>收货单位</td>
                            <td colspan="5">{{ formData.enterpriseName || '' }}</td>
                        </tr>
                        <tr>
                            <td>收货人</td>
                            <td>{{ formData.consigneeName || '' }}</td>
                            <td>联系电话</td>
                            <td colspan="3">{{ formData.consigneePhone || '' }}</td>
                        </tr>
                        <tr class="pure-table-odd">
                            <td>收货地址</td>
                            <td colspan="5">{{ formData.consigneeAddress || '' }}</td>
                        </tr>
                        <tr>
                            <td colspan="6">
                                <div class="font-bold text-left">
                                    采购方已知晓：《业务配套服务包采购清单》签字、盖章后生效，生效后采购方挑选的上述终端如有更换需求，需按协议中4.6执行。
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mb-30px">
                <p>附件2：业务入网清单</p>
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th colspan="7" class="font-bold">业务入网清单</th>
                        </tr>
                        <tr>
                            <th colspan="2">协议编号</th>
                            <th colspan="5"></th>
                        </tr>
                        <tr>
                            <th>序号</th>
                            <th>套餐名称</th>
                            <th>办理数量</th>
                            <th>月套餐费(元/月/户)</th>
                            <th>承诺在网期限(月)</th>
                            <th>定向电子券金额(元/月/户)</th>
                            <th>入网日期</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, idx) of setmealList" :key="item.id">
                            <td>{{ idx + 1 }}</td>
                            <td>{{ item.name || '' }}</td>
                            <td>{{ item.number || '' }}</td>
                            <td>{{ item.monthlyPayment || '' }}</td>
                            <td>{{ item.period || '' }}</td>
                            <td>{{ item.voucherAmount || '' }}</td>
                            <td>{{ item.tradeTime || '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex submit-footer">
            <VanButton block type="info" native-type="button" class="submit-button" @click="submitData">{{
                isSubmit ? '提交' : '确定'
            }}</VanButton>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance } from 'vue'
import { useCache } from '@/hooks/useCache'
import router from '@/router'
import { isEmpty } from 'lodash-es'

import { enterpriseContractPreview } from '@/api/preview'
import { updateStep } from '@/api/common'

export default {
    name: 'Preview',
    props: {
        isSubmit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            buyListIndex: [],
            buyList: {},
            setmealList: [],
            formData: {}
        }
    },
    methods: {
        async submitData() {
            const { wsCache } = useCache()
            const enterpriseId = wsCache.get('enterpriseId')
            try {
                await updateStep({
                    data: {
                        enterpriseId: enterpriseId || '',
                        step: '8'
                    }
                })
                setTimeout(() => router.push({ name: 'Audit' }), 1500)
            } catch (err) {
                return false
            }
        },
        async backFillData() {
            const { wsCache } = useCache()
            const instance = getCurrentInstance()
            const { $toast } = instance.proxy
            const enterpriseId = wsCache.get('enterpriseId')
            if (enterpriseId) {
                try {
                    const res = await enterpriseContractPreview({
                        data: {
                            enterpriseId
                        },
                        hideloading: true
                    })
                    if (res && !isEmpty(res.data)) {
                        this.formData = res.data
                        res.data.buyList.forEach(item => {
                            if (this.buyList[item.period]) {
                                this.buyList[item.period].push(item)
                            } else {
                                this.buyListIndex.push(item.period)
                                this.buyList[item.period] = [item]
                            }
                        })
                        this.buyListIndex = this.buyListIndex.sort()
                        this.setmealList = res.data.setmealList
                    }
                } catch (err) {
                    return false
                }
            } else {
                $toast.fail({
                    message: '请重新登录',
                    onClose: () => {
                        router.push({ name: 'Login' })
                    }
                })
            }
        }
    },
    mounted() {
        this.backFillData()
    }
}
</script>

<style lang="scss" scoped>
.preview-component {
    font-size: 14px;
    color: #333;
    &__body {
        padding: 24px 15px;
        padding-bottom: 0;
    }
    h1 {
        font-size: 20px;
        font-weight: bold;
    }
    .text-underline {
        text-decoration: underline;
        text-underline-offset: 4px;
    }
    p {
        line-height: 26px;
        word-break: break-all;
        &.indent-lv1 {
            text-indent: 24px;
        }
    }
    .text-label {
        margin-right: 10px;
        line-height: 26px;
    }
    dl.indent-lv2 {
        padding-left: 18px;
    }
    .pure-table {
        width: 200%;
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        border: 1px solid #cbcbcb;
        font-size: 14px;
    }

    .pure-table caption {
        color: #000;
        font: italic 85%/1 arial, sans-serif;
        padding: 1em 0;
        text-align: center;
    }

    .pure-table td,
    .pure-table th {
        border-left: 1px solid #cbcbcb;
        border-bottom: 1px solid #cbcbcb;
        font-size: inherit;
        margin: 0;
        overflow: visible;
        padding: 0.5em 1em;
        text-align: center;
    }
    .pure-table th {
        padding: 10px 5px;
        vertical-align: middle;
    }

    .pure-table thead {
        background-color: #e0e0e0;
        color: #000;
        text-align: left;
        vertical-align: bottom;
    }

    .pure-table td {
        background-color: transparent;
    }

    .pure-table-odd td {
        background-color: #f2f2f2;
    }
}
</style>
