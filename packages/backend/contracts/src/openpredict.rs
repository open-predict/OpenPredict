// Automatically generated rust module for 'openpredict.proto' file

#![allow(non_snake_case)]
#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(unused_imports)]
#![allow(unknown_lints)]
#![allow(clippy::all)]
#![cfg_attr(rustfmt, rustfmt_skip)]


use quick_protobuf::{MessageInfo, MessageRead, MessageWrite, BytesReader, Writer, WriterBackend, Result};
use quick_protobuf::sizeofs::*;
use super::*;

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct Instruction<'a> {
    pub Contents: openpredict::mod_Instruction::OneOfContents<'a>,
}

impl<'a> MessageRead<'a> for Instruction<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.Contents = openpredict::mod_Instruction::OneOfContents::initMarket(r.read_message::<openpredict::mod_Instruction::InitMarket>(bytes)?),
                Ok(18) => msg.Contents = openpredict::mod_Instruction::OneOfContents::initMarketAccount(r.read_message::<openpredict::mod_Instruction::InitMarketAccount>(bytes)?),
                Ok(26) => msg.Contents = openpredict::mod_Instruction::OneOfContents::buyShares(r.read_message::<openpredict::mod_Instruction::BuyShares>(bytes)?),
                Ok(34) => msg.Contents = openpredict::mod_Instruction::OneOfContents::resolveMarket(r.read_message::<openpredict::mod_Instruction::ResolveMarket>(bytes)?),
                Ok(42) => msg.Contents = openpredict::mod_Instruction::OneOfContents::redeemShares(r.read_message::<openpredict::mod_Instruction::RedeemShares>(bytes)?),
                Ok(50) => msg.Contents = openpredict::mod_Instruction::OneOfContents::createAccount(r.read_message::<openpredict::mod_Instruction::CreateAccount>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for Instruction<'a> {
    fn get_size(&self) -> usize {
        0
        + match self.Contents {
            openpredict::mod_Instruction::OneOfContents::initMarket(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_Instruction::OneOfContents::initMarketAccount(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_Instruction::OneOfContents::buyShares(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_Instruction::OneOfContents::resolveMarket(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_Instruction::OneOfContents::redeemShares(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_Instruction::OneOfContents::createAccount(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_Instruction::OneOfContents::None => 0,
    }    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        match self.Contents {            openpredict::mod_Instruction::OneOfContents::initMarket(ref m) => { w.write_with_tag(10, |w| w.write_message(m))? },
            openpredict::mod_Instruction::OneOfContents::initMarketAccount(ref m) => { w.write_with_tag(18, |w| w.write_message(m))? },
            openpredict::mod_Instruction::OneOfContents::buyShares(ref m) => { w.write_with_tag(26, |w| w.write_message(m))? },
            openpredict::mod_Instruction::OneOfContents::resolveMarket(ref m) => { w.write_with_tag(34, |w| w.write_message(m))? },
            openpredict::mod_Instruction::OneOfContents::redeemShares(ref m) => { w.write_with_tag(42, |w| w.write_message(m))? },
            openpredict::mod_Instruction::OneOfContents::createAccount(ref m) => { w.write_with_tag(50, |w| w.write_message(m))? },
            openpredict::mod_Instruction::OneOfContents::None => {},
    }        Ok(())
    }
}

pub mod mod_Instruction {

use std::borrow::Cow;
use super::*;

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct InitMarket<'a> {
    pub cid: Cow<'a, [u8]>,
    pub amm_address: Cow<'a, [u8]>,
    pub subsidy: u64,
}

impl<'a> MessageRead<'a> for InitMarket<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.cid = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(18) => msg.amm_address = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(24) => msg.subsidy = r.read_uint64(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for InitMarket<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.cid == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.cid).len()) }
        + if self.amm_address == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.amm_address).len()) }
        + if self.subsidy == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.subsidy) as u64) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.cid != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.cid))?; }
        if self.amm_address != Cow::Borrowed(b"") { w.write_with_tag(18, |w| w.write_bytes(&**&self.amm_address))?; }
        if self.subsidy != 0u64 { w.write_with_tag(24, |w| w.write_uint64(*&self.subsidy))?; }
        Ok(())
    }
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct InitMarketAccount<'a> {
    pub amm_address: Cow<'a, [u8]>,
}

impl<'a> MessageRead<'a> for InitMarketAccount<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.amm_address = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for InitMarketAccount<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.amm_address == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.amm_address).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.amm_address != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.amm_address))?; }
        Ok(())
    }
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct BuyShares<'a> {
    pub amm_address: Cow<'a, [u8]>,
    pub micro_usdc: u64,
    pub direction: bool,
    pub expected_amount: u64,
    pub drift: u64,
}

impl<'a> MessageRead<'a> for BuyShares<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.amm_address = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(16) => msg.micro_usdc = r.read_uint64(bytes)?,
                Ok(24) => msg.direction = r.read_bool(bytes)?,
                Ok(32) => msg.expected_amount = r.read_uint64(bytes)?,
                Ok(40) => msg.drift = r.read_uint64(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for BuyShares<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.amm_address == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.amm_address).len()) }
        + if self.micro_usdc == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.micro_usdc) as u64) }
        + if self.direction == false { 0 } else { 1 + sizeof_varint(*(&self.direction) as u64) }
        + if self.expected_amount == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.expected_amount) as u64) }
        + if self.drift == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.drift) as u64) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.amm_address != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.amm_address))?; }
        if self.micro_usdc != 0u64 { w.write_with_tag(16, |w| w.write_uint64(*&self.micro_usdc))?; }
        if self.direction != false { w.write_with_tag(24, |w| w.write_bool(*&self.direction))?; }
        if self.expected_amount != 0u64 { w.write_with_tag(32, |w| w.write_uint64(*&self.expected_amount))?; }
        if self.drift != 0u64 { w.write_with_tag(40, |w| w.write_uint64(*&self.drift))?; }
        Ok(())
    }
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct ResolveMarket<'a> {
    pub amm_address: Cow<'a, [u8]>,
    pub direction: bool,
}

impl<'a> MessageRead<'a> for ResolveMarket<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.amm_address = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(16) => msg.direction = r.read_bool(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for ResolveMarket<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.amm_address == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.amm_address).len()) }
        + if self.direction == false { 0 } else { 1 + sizeof_varint(*(&self.direction) as u64) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.amm_address != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.amm_address))?; }
        if self.direction != false { w.write_with_tag(16, |w| w.write_bool(*&self.direction))?; }
        Ok(())
    }
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct RedeemShares<'a> {
    pub amm_address: Cow<'a, [u8]>,
}

impl<'a> MessageRead<'a> for RedeemShares<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.amm_address = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for RedeemShares<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.amm_address == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.amm_address).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.amm_address != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.amm_address))?; }
        Ok(())
    }
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct CreateAccount<'a> {
    pub username: Cow<'a, str>,
    pub cid: Cow<'a, [u8]>,
}

impl<'a> MessageRead<'a> for CreateAccount<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.username = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(18) => msg.cid = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for CreateAccount<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.username == "" { 0 } else { 1 + sizeof_len((&self.username).len()) }
        + if self.cid == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.cid).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.username != "" { w.write_with_tag(10, |w| w.write_string(&**&self.username))?; }
        if self.cid != Cow::Borrowed(b"") { w.write_with_tag(18, |w| w.write_bytes(&**&self.cid))?; }
        Ok(())
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum OneOfContents<'a> {
    initMarket(openpredict::mod_Instruction::InitMarket<'a>),
    initMarketAccount(openpredict::mod_Instruction::InitMarketAccount<'a>),
    buyShares(openpredict::mod_Instruction::BuyShares<'a>),
    resolveMarket(openpredict::mod_Instruction::ResolveMarket<'a>),
    redeemShares(openpredict::mod_Instruction::RedeemShares<'a>),
    createAccount(openpredict::mod_Instruction::CreateAccount<'a>),
    None,
}

impl<'a> Default for OneOfContents<'a> {
    fn default() -> Self {
        OneOfContents::None
    }
}

}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct MarketData<'a> {
    pub Contents: openpredict::mod_MarketData::OneOfContents<'a>,
}

impl<'a> MessageRead<'a> for MarketData<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.Contents = openpredict::mod_MarketData::OneOfContents::v1(r.read_message::<openpredict::mod_MarketData::V1>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for MarketData<'a> {
    fn get_size(&self) -> usize {
        0
        + match self.Contents {
            openpredict::mod_MarketData::OneOfContents::v1(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_MarketData::OneOfContents::None => 0,
    }    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        match self.Contents {            openpredict::mod_MarketData::OneOfContents::v1(ref m) => { w.write_with_tag(10, |w| w.write_message(m))? },
            openpredict::mod_MarketData::OneOfContents::None => {},
    }        Ok(())
    }
}

pub mod mod_MarketData {

use std::borrow::Cow;
use super::*;

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct V1<'a> {
    pub yes: u64,
    pub no: u64,
    pub subsidy: u64,
    pub cid: Cow<'a, [u8]>,
    pub amm_address: Cow<'a, [u8]>,
    pub user_key: Cow<'a, [u8]>,
}

impl<'a> MessageRead<'a> for V1<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(8) => msg.yes = r.read_uint64(bytes)?,
                Ok(16) => msg.no = r.read_uint64(bytes)?,
                Ok(24) => msg.subsidy = r.read_uint64(bytes)?,
                Ok(34) => msg.cid = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(42) => msg.amm_address = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(50) => msg.user_key = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for V1<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.yes == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.yes) as u64) }
        + if self.no == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.no) as u64) }
        + if self.subsidy == 0u64 { 0 } else { 1 + sizeof_varint(*(&self.subsidy) as u64) }
        + if self.cid == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.cid).len()) }
        + if self.amm_address == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.amm_address).len()) }
        + if self.user_key == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.user_key).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.yes != 0u64 { w.write_with_tag(8, |w| w.write_uint64(*&self.yes))?; }
        if self.no != 0u64 { w.write_with_tag(16, |w| w.write_uint64(*&self.no))?; }
        if self.subsidy != 0u64 { w.write_with_tag(24, |w| w.write_uint64(*&self.subsidy))?; }
        if self.cid != Cow::Borrowed(b"") { w.write_with_tag(34, |w| w.write_bytes(&**&self.cid))?; }
        if self.amm_address != Cow::Borrowed(b"") { w.write_with_tag(42, |w| w.write_bytes(&**&self.amm_address))?; }
        if self.user_key != Cow::Borrowed(b"") { w.write_with_tag(50, |w| w.write_bytes(&**&self.user_key))?; }
        Ok(())
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum OneOfContents<'a> {
    v1(openpredict::mod_MarketData::V1<'a>),
    None,
}

impl<'a> Default for OneOfContents<'a> {
    fn default() -> Self {
        OneOfContents::None
    }
}

}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct MarketUserData<'a> {
    pub Contents: openpredict::mod_MarketUserData::OneOfContents<'a>,
}

impl<'a> MessageRead<'a> for MarketUserData<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.Contents = openpredict::mod_MarketUserData::OneOfContents::v1(r.read_message::<openpredict::mod_MarketUserData::V1>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for MarketUserData<'a> {
    fn get_size(&self) -> usize {
        0
        + match self.Contents {
            openpredict::mod_MarketUserData::OneOfContents::v1(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_MarketUserData::OneOfContents::None => 0,
    }    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        match self.Contents {            openpredict::mod_MarketUserData::OneOfContents::v1(ref m) => { w.write_with_tag(10, |w| w.write_message(m))? },
            openpredict::mod_MarketUserData::OneOfContents::None => {},
    }        Ok(())
    }
}

pub mod mod_MarketUserData {

use std::borrow::Cow;
use super::*;

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct V1<'a> {
    pub user_key: Cow<'a, [u8]>,
    pub shares: i64,
}

impl<'a> MessageRead<'a> for V1<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.user_key = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(16) => msg.shares = r.read_sint64(bytes)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for V1<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.user_key == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.user_key).len()) }
        + if self.shares == 0i64 { 0 } else { 1 + sizeof_sint64(*(&self.shares)) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.user_key != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.user_key))?; }
        if self.shares != 0i64 { w.write_with_tag(16, |w| w.write_sint64(*&self.shares))?; }
        Ok(())
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum OneOfContents<'a> {
    v1(openpredict::mod_MarketUserData::V1<'a>),
    None,
}

impl<'a> Default for OneOfContents<'a> {
    fn default() -> Self {
        OneOfContents::None
    }
}

}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct UserProfileData<'a> {
    pub Contents: openpredict::mod_UserProfileData::OneOfContents<'a>,
}

impl<'a> MessageRead<'a> for UserProfileData<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.Contents = openpredict::mod_UserProfileData::OneOfContents::v1(r.read_message::<openpredict::mod_UserProfileData::V1>(bytes)?),
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for UserProfileData<'a> {
    fn get_size(&self) -> usize {
        0
        + match self.Contents {
            openpredict::mod_UserProfileData::OneOfContents::v1(ref m) => 1 + sizeof_len((m).get_size()),
            openpredict::mod_UserProfileData::OneOfContents::None => 0,
    }    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        match self.Contents {            openpredict::mod_UserProfileData::OneOfContents::v1(ref m) => { w.write_with_tag(10, |w| w.write_message(m))? },
            openpredict::mod_UserProfileData::OneOfContents::None => {},
    }        Ok(())
    }
}

pub mod mod_UserProfileData {

use std::borrow::Cow;
use super::*;

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Debug, Default, PartialEq, Clone)]
pub struct V1<'a> {
    pub cid: Cow<'a, [u8]>,
    pub username: Cow<'a, str>,
}

impl<'a> MessageRead<'a> for V1<'a> {
    fn from_reader(r: &mut BytesReader, bytes: &'a [u8]) -> Result<Self> {
        let mut msg = Self::default();
        while !r.is_eof() {
            match r.next_tag(bytes) {
                Ok(10) => msg.cid = r.read_bytes(bytes).map(Cow::Borrowed)?,
                Ok(18) => msg.username = r.read_string(bytes).map(Cow::Borrowed)?,
                Ok(t) => { r.read_unknown(bytes, t)?; }
                Err(e) => return Err(e),
            }
        }
        Ok(msg)
    }
}

impl<'a> MessageWrite for V1<'a> {
    fn get_size(&self) -> usize {
        0
        + if self.cid == Cow::Borrowed(b"") { 0 } else { 1 + sizeof_len((&self.cid).len()) }
        + if self.username == "" { 0 } else { 1 + sizeof_len((&self.username).len()) }
    }

    fn write_message<W: WriterBackend>(&self, w: &mut Writer<W>) -> Result<()> {
        if self.cid != Cow::Borrowed(b"") { w.write_with_tag(10, |w| w.write_bytes(&**&self.cid))?; }
        if self.username != "" { w.write_with_tag(18, |w| w.write_string(&**&self.username))?; }
        Ok(())
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum OneOfContents<'a> {
    v1(openpredict::mod_UserProfileData::V1<'a>),
    None,
}

impl<'a> Default for OneOfContents<'a> {
    fn default() -> Self {
        OneOfContents::None
    }
}

}

