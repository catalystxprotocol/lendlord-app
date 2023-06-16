<template>
    <div class="home">
        <div class="home__bg_box">
            <div class="home__bg_box__bg"></div>
        </div>
        <div class="home__container">
            <div class="home__container__title"> One place to make NFT rental possible </div>
            <MyButton class="home__container__rent_btn" @callback="toMarketplace">
                <span>Rent</span>
                <i class="iconfont icon-tiaozhuan"></i>
            </MyButton>
            <div class="home__container__about_lendlord">
                <div class="home__container__about_lendlord__title"> About Lendlord </div>
                <div class="home__container__about_lendlord__subtitle">
                    One stop solution to boost NFT capabilities
                </div>
                <div class="home__container__about_lendlord__list">
                    <div
                        v-for="(item, idx) in aboutLendlordList"
                        :key="idx"
                        class="home__container__about_lendlord__list__box"
                    >
                        <div class="home__container__about_lendlord__list__box__left">
                            <img
                                :src="item.icon"
                                alt=""
                                class="home__container__about_lendlord__list__box__left__icon"
                            />
                        </div>
                        <div class="home__container__about_lendlord__list__box__right">
                            <div class="home__container__about_lendlord__list__box__right__title">
                                {{ item.title }}
                            </div>
                            <div
                                class="home__container__about_lendlord__list__box__right__subtitle"
                            >
                                {{ item.subtitle }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home__container__top_collections">
                <div class="home__container__top_collections__title">
                    <div class="home__container__top_collections__title__title">
                        Top Collections
                    </div>
                    <div class="home__container__top_collections__title__count">
                        <div class="home__container__top_collections__title__count__icon_box">
                            <i class="iconfont icon-jihe"></i>
                        </div>
                        <div class="home__container__top_collections__title__count__text">
                            include
                            <span
                                class="home__container__top_collections__title__count__text__count"
                                >{{ collectionCount }}</span
                            >
                            collections
                        </div>
                    </div>
                </div>
                <div class="home__container__top_collections__collections">
                    <div v-if="topCollectionsList.length > 0">
                        <swiper
                            ref="swiperRef"
                            :slides-per-view="swiperViewCount"
                            :space-between="32"
                            :pagination="false"
                            :navigation="false"
                            class="mySwiper"
                        >
                            <swiper-slide v-for="(item, idx) in topCollectionsList" :key="idx">
                                <div class="home__container__top_collections__collections__box">
                                    <div
                                        class="home__container__top_collections__collections__box__image_box"
                                    >
                                        <img
                                            :src="item.image"
                                            alt=""
                                            class="home__container__top_collections__collections__box__image_box__img"
                                        />
                                    </div>
                                    <div
                                        class="home__container__top_collections__collections__box__info_box"
                                    >
                                        <span
                                            class="home__container__top_collections__collections__box__info_box__name"
                                            >{{ item.name }}</span
                                        >
                                    </div>
                                    <div
                                        class="home__container__top_collections__collections__box__header_icon_box"
                                    >
                                        <img
                                            :src="item.headPicture"
                                            alt=""
                                            class="home__container__top_collections__collections__box__header_icon_box__img"
                                        />
                                    </div>
                                </div>
                            </swiper-slide>
                        </swiper>
                        <!--    数字 swiperViewCount 为首页展示数量 ，插件提供activeIndex 最大为 list.length - swiperViewCount -->
                        <div
                            v-if="
                                topCollectionsList.length > swiperViewCount && swiperActiveIndex > 0
                            "
                            class="home__container__top_collections__collections__prev_box"
                        >
                            <div
                                class="home__container__top_collections__collections__prev_box__icon_box button_box"
                                @click="prev"
                            >
                                <i class="iconfont icon-xiangzuofanye"></i>
                            </div>
                        </div>
                        <div
                            v-if="
                                topCollectionsList.length > swiperViewCount &&
                                swiperActiveIndex < topCollectionsList.length - swiperViewCount
                            "
                            class="home__container__top_collections__collections__next_box"
                        >
                            <div
                                class="home__container__top_collections__collections__next_box__icon_box button_box"
                                @click="next"
                            >
                                <i class="iconfont icon-tiaozhuan"></i>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <ComingSoon></ComingSoon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { homeModule } from '@/views/home/composable';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css/pagination';
    import ComingSoon from '@/components/ComingSoon.vue';

    const {
        aboutLendlordList,
        topCollectionsList,
        swiperRef,
        prev,
        swiperActiveIndex,
        next,
        swiperViewCount,
        collectionCount,
        toMarketplace
    } = homeModule();
</script>

<style lang="less" scoped>
    .home {
        position: relative;
        width: 100%;
        min-height: 100vh;

        &__bg_box {
            position: absolute;
            top: -100px;
            width: 100%;
            overflow: hidden;

            &__bg {
                position: relative;
                //left: 254px;
                left: calc((100% - 1200px) / 2 + 254px);
                z-index: 0;
                width: 1172px;
                height: 1041px;
                background: url('../../assets/image/banner.png') no-repeat center/100% 100%;
            }
        }

        &__container {
            position: relative;
            width: 1200px;
            margin: 0 auto;
            padding-top: 81px;
            padding-bottom: 180px;

            &__title {
                .Inter-Regular_Bold;

                position: relative;
                z-index: 10;
                width: 609px;
                height: 288px;
                margin-left: 33px;
                color: #000000;
                font-size: 78px;
                line-height: 96px;
                letter-spacing: -1.81px;
            }

            &__rent_btn {
                width: 172px;
                height: 60px;
                margin: 79px 0 0 33px;

                span {
                    .Inter-Regular_Semi-Bold;

                    margin: 0 24px 0 0;
                    color: #ffffff;
                    font-size: 28px;
                    line-height: 34px;
                }

                .iconfont {
                    color: #ffffff;
                    font-size: 20px;
                }
            }

            &__about_lendlord {
                position: relative;
                z-index: 10;
                margin: 152px 0 0 46px;

                &__title {
                    .Inter-Regular_Bold;

                    color: #000000;
                    font-size: 38px;
                    line-height: 46px;
                    letter-spacing: -0.5px;
                }

                &__subtitle {
                    margin-top: 8px;
                    color: var(--bj-text-normal);
                    font-weight: 400;
                    font-size: 18px;
                    font-family: Inter-Regular, Inter;
                    line-height: 28px;
                    letter-spacing: -0.2px;
                }

                &__list {
                    display: flex;
                    flex-wrap: wrap;
                    width: 1200px;
                    margin-top: 60px;

                    &__box {
                        display: flex;
                        flex-shrink: 0;
                        align-items: center;
                        width: 540px;
                        height: 200px;
                        margin: 0 32px 32px 0;
                        background: #ffffff;
                        border-radius: 16px;
                        box-shadow: var(--bj-box-shadow-card);

                        &__left {
                            flex-shrink: 0;
                            width: 114px;
                            height: 114px;
                            margin: 0 43px 0 39px;

                            &__icon {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        &__right {
                            width: 320px;

                            &__title {
                                .Inter-Regular_Semi-Bold;

                                color: #000000;
                                font-size: 28px;
                                line-height: 34px;
                                letter-spacing: -0.8px;
                            }

                            &__subtitle {
                                margin-top: 8px;
                                color: var(--bj-text-normal);
                                font-weight: 400;
                                font-size: 18px;
                                font-family: Inter-Regular, Inter;
                                line-height: 28px;
                            }
                        }
                    }
                }
            }

            &__top_collections {
                width: 1118px;
                margin: 48px 0 0 46px;

                &__title {
                    padding-bottom: 8px;
                    border-bottom: 1px solid var(--bj-border-color);

                    &__title {
                        .Inter-Regular_Bold;

                        color: #000000;
                        font-size: 38px;
                        line-height: 46px;
                    }

                    &__count {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        width: 100%;
                        margin-top: 24px;

                        &__icon_box {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 34px;
                            height: 34px;
                            margin-right: 8px;
                            background: var(--bj-background-color-fourth);
                            border-radius: 50%;
                        }

                        &__text {
                            color: var(--bj-text-normal);
                            font-weight: 400;
                            font-size: 18px;
                            font-family: Inter-Regular, Inter;
                            line-height: 28px;

                            &__count {
                                .Inter-Regular_Semi-Bold;
                            }
                        }
                    }
                }

                &__collections {
                    position: relative;
                    margin-top: 31px;

                    &&__box {
                        width: 100px;
                        height: 100px;
                    }

                    &__prev_box,
                    &__next_box {
                        position: absolute;
                        top: 0;
                        z-index: 100;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 80px;
                        height: 272px;

                        &__icon_box {
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 60px;
                            height: 60px;
                            background: var(--bj-primary-color);
                            border-radius: 50%;
                            cursor: pointer;

                            .iconfont {
                                color: #ffffff;
                                font-size: 20px;
                            }
                        }
                    }

                    &__prev_box {
                        left: 0;
                        background: linear-gradient(
                            90deg,
                            #fafaf9 0%,
                            rgba(250, 250, 249, 0.55) 44%,
                            rgba(250, 250, 249, 0) 100%
                        );

                        &__icon_box {
                            left: -40px;

                            .iconfont {
                                color: #ffffff;
                                font-size: 20px;
                            }
                        }
                    }

                    &__next_box {
                        right: 0;
                        background: linear-gradient(
                            90deg,
                            rgba(250, 250, 249, 0) 0%,
                            rgba(250, 250, 249, 0.55) 44%,
                            #fafaf9 100%
                        );

                        &__icon_box {
                            left: 40px;

                            .iconfont {
                                color: #ffffff;
                                font-size: 20px;
                            }
                        }
                    }
                }
            }
        }
    }

    .home__container__top_collections__collections__box {
        position: relative;
        width: 348px;
        height: 274px;
        border-radius: 16px;
        box-shadow: 0 16px 20px 0 var(--bj-box-shadow-card);

        &__image_box {
            width: 100%;
            height: 188px;

            &__img {
                width: 100%;
                height: 100%;
                border-top-left-radius: 16px;
                border-top-right-radius: 16px;
            }
        }

        &__info_box {
            box-sizing: border-box;
            padding-top: 44px;
            padding-bottom: 12px;
            background: #ffffff;
            border-bottom-right-radius: 16px;
            border-bottom-left-radius: 16px;

            &__name {
                .Inter-Regular_Semi-Bold;

                margin: 0 0 0 32px;
                color: #000000;
                font-size: 18px;
                line-height: 28px;
                text-shadow: 0 16px 20px var(--bj-box-shadow-card);
            }
        }

        &__header_icon_box {
            position: absolute;
            top: 140px;
            left: 32px;
            box-sizing: border-box;
            width: 80px;
            height: 80px;
            border: 1px solid #ffffff;
            border-radius: 8px;

            &__img {
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
        }
    }
</style>
